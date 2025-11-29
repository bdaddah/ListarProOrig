const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert');

const BASE_URL = (process.env.API_BASE || 'http://127.0.0.1:3000').replace(/\/$/, '');
const API_BASE = `${BASE_URL}/wp-json`;
const client = axios.create({ baseURL: API_BASE, timeout: 20000 });

const results = [];
let failureCount = 0;

const tempFiles = [];

function summarise(value) {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'string') {
    return value.length > 120 ? `${value.slice(0, 117)}...` : value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  try {
    const json = JSON.stringify(value);
    return json.length > 160 ? `${json.slice(0, 157)}...` : json;
  } catch {
    return String(value);
  }
}

function formatError(error) {
  if (error.response) {
    const body =
      typeof error.response.data === 'string'
        ? error.response.data
        : JSON.stringify(error.response.data);
    return `${error.response.status} ${body}`;
  }
  if (error.request) {
    return 'No response received';
  }
  return error.message || String(error);
}

async function runTest(name, fn) {
  const start = Date.now();
  try {
    const value = await fn();
    results.push({
      name,
      status: 'pass',
      duration: Date.now() - start,
      detail: summarise(value),
    });
    return value;
  } catch (error) {
    failureCount += 1;
    results.push({
      name,
      status: 'fail',
      duration: Date.now() - start,
      error: formatError(error),
    });
    return undefined;
  }
}

async function main() {
  const ctx = {};

  await runTest('Health check', async () => {
    const res = await axios.get(`${BASE_URL}/health`, { timeout: 10000 });
    assert.strictEqual(res.data.status, 'ok', 'Unexpected health status');
    return `status=${res.data.status}`;
  });

  await runTest('Settings init', async () => {
    const res = await client.get('/listar/v1/setting/init');
    assert.ok(res.data.success, 'Request failed');
    const keys = Object.keys(res.data.data || {});
    assert.ok(keys.length > 0, 'Settings payload empty');
    return `fields=${keys.length}`;
  });

  await runTest('Payment methods', async () => {
    const res = await client.get('/listar/v1/setting/payment');
    assert.ok(res.data.success, 'Request failed');
    const methods = res.data.payment?.methods;
    assert.ok(Array.isArray(methods), 'methods missing');
    assert.ok(methods.length > 0, 'No payment methods returned');
    return `methods=${methods.length}`;
  });

  await runTest('Home data', async () => {
    const res = await client.get('/listar/v1/home/init');
    assert.ok(res.data.success, 'Request failed');
    assert.ok((res.data.data?.sliders || []).length > 0, 'Empty slider list');
    assert.ok((res.data.data?.categories || []).length > 0, 'Empty categories');
    assert.ok((res.data.data?.locations || []).length > 0, 'Empty locations');
    assert.ok((res.data.data?.recent_posts || []).length > 0, 'Empty recent posts');
    return `recent=${res.data.data.recent_posts.length}`;
  });

  await runTest('Home widgets', async () => {
    const res = await client.get('/listar/v1/home/widget');
    assert.ok(res.data.success, 'Request failed');
    assert.ok(Array.isArray(res.data.data?.widgets), 'widgets missing');
    return `widgets=${res.data.data.widgets.length}`;
  });

  await runTest('Category list', async () => {
    const res = await client.get('/listar/v1/category/list');
    assert.ok(res.data.success, 'Request failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    assert.ok(res.data.data.length > 0, 'No categories');
    return `count=${res.data.data.length}`;
  });

  await runTest('Discovery categories', async () => {
    const res = await client.get('/listar/v1/category/list_discover');
    assert.ok(res.data.success, 'Request failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    return `count=${res.data.data.length}`;
  });

  await runTest('Location list', async () => {
    const res = await client.get('/listar/v1/location/list');
    assert.ok(res.data.success, 'Request failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    assert.ok(res.data.data.length > 0, 'No locations returned');
    return `count=${res.data.data.length}`;
  });

  await runTest('Listing search', async () => {
    const res = await client.get('/listar/v1/place/list', {
      params: { per_page: 5, page: 1 },
    });
    assert.ok(res.data.success, 'Request failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    assert.ok(res.data.data.length > 0, 'No listings returned');
    ctx.listingId = res.data.data[0]?.ID;
    assert.ok(ctx.listingId, 'Missing sample listing id');
    return `listingId=${ctx.listingId}`;
  });

  await runTest('Listing keyword search', async () => {
    const res = await client.get('/listar/v1/place/list', {
      params: { s: 'Spa', per_page: 5 },
    });
    assert.ok(res.data.success, 'Request failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    return `results=${res.data.data.length}`;
  });

  await runTest('Listing detail', async () => {
    const res = await client.get('/listar/v1/place/view', {
      params: { id: ctx.listingId },
    });
    assert.ok(res.data.success, 'Request failed');
    const detail = res.data.data || {};
    assert.ok(detail.ID === ctx.listingId, 'Incorrect listing returned');
    assert.ok(Array.isArray(detail.galleries), 'Missing galleries');
    assert.ok(detail.galleries.length > 0, 'Empty galleries');
    ctx.listingSupportsBooking = !!detail.booking_use;
    return `galleries=${detail.galleries.length}`;
  });

  await runTest('Submit settings', async () => {
    const res = await client.get('/listar/v1/place/form');
    assert.ok(res.data.success, 'Request failed');
    assert.ok(Array.isArray(res.data.data?.categories), 'categories missing');
    return `categories=${res.data.data.categories.length}`;
  });

  await runTest('Tags lookup', async () => {
    const res = await client.get('/listar/v1/place/terms', {
      params: { s: 'coffee' },
    });
    assert.ok(res.data.success, 'Request failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    return `matches=${res.data.data.length}`;
  });

  await runTest('Blog list', async () => {
    const res = await client.get('/listar/v1/post/home');
    assert.ok(res.data.success, 'Request failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    assert.ok(res.data.data.length > 0, 'No blog posts');
    ctx.postId = res.data.data[0]?.ID;
    return `posts=${res.data.data.length}`;
  });

  await runTest('Blog detail', async () => {
    const res = await client.get('/listar/v1/post/view', { params: { id: ctx.postId } });
    assert.ok(res.data.success, 'Request failed');
    assert.strictEqual(res.data.data?.ID, ctx.postId, 'Incorrect post returned');
    return `title=${res.data.data?.post_title}`;
  });

  await runTest('Forgot password', async () => {
    const res = await client.post('/listar/v1/auth/reset_password', {
      email: `ghost+${Date.now()}@example.com`,
    });
    assert.ok(res.data.success, 'Request failed');
    return res.data.message;
  });

  await runTest('Register user', async () => {
    const email = `test+${Date.now()}@example.com`;
    ctx.regEmail = email;
    ctx.regPassword = 'Test1234!';
    const res = await client.post('/listar/v1/auth/register', {
      email,
      password: ctx.regPassword,
      username: `user${Date.now()}`,
      first_name: 'Test',
      last_name: 'User',
    });
    assert.ok(res.data.success, 'Registration failed');
    return res.data.message;
  });

  await runTest('Login (demo)', async () => {
    const res = await client.post('/jwt-auth/v1/token', {
      username: 'demo@example.com',
      password: 'demo123',
    });
    assert.ok(res.data.success, 'Login failed');
    ctx.token = res.data.data?.token;
    ctx.userId = res.data.data?.id;
    assert.ok(ctx.token, 'Missing JWT token');
    client.defaults.headers.common.Authorization = `Bearer ${ctx.token}`;
    return `userId=${ctx.userId}`;
  });

  await runTest('Validate token', async () => {
    const res = await client.post('/jwt-auth/v1/token/validate');
    assert.ok(res.data.success, 'Token validation failed');
    return res.data.message;
  });

  await runTest('Account profile', async () => {
    const res = await client.get('/listar/v1/auth/user');
    assert.ok(res.data.success, 'Profile fetch failed');
    assert.strictEqual(res.data.data?.id, ctx.userId, 'Unexpected user id');
    return `email=${res.data.data?.email}`;
  });

  await runTest('Update profile', async () => {
    const res = await client.post('/wp/v2/users/me', {
      first_name: 'Demo',
      last_name: 'User',
      description: 'Smoke test update',
    });
    assert.ok(res.data.success, 'Profile update failed');
    return res.data.message;
  });

  await runTest('Request OTP', async () => {
    const res = await client.post('/listar/v1/auth/otp');
    assert.ok(res.data.success, 'OTP request failed');
    return `expires=${res.data.data?.exp_time}`;
  });

  await runTest('Change password (noop)', async () => {
    const res = await client.post('/wp/v2/users/me/password', {
      password: 'demo123',
      new_password: 'demo123',
    });
    assert.ok(res.data.success, 'Change password failed');
    return res.data.message;
  });

  await runTest('Wishlist add', async () => {
    const res = await client.post('/listar/v1/wishlist/save', { post_id: ctx.listingId });
    assert.ok(res.data.success, 'Add wishlist failed');
    return res.data.message;
  });

  await runTest('Wishlist list', async () => {
    const res = await client.get('/listar/v1/wishlist/list');
    assert.ok(res.data.success, 'Wishlist fetch failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    assert.ok(res.data.data.some((item) => item.ID === ctx.listingId), 'Listing not in wishlist');
    return `items=${res.data.data.length}`;
  });

  await runTest('Wishlist remove', async () => {
    const res = await client.post('/listar/v1/wishlist/remove', { post_id: ctx.listingId });
    assert.ok(res.data.success, 'Remove wishlist failed');
    return res.data.message;
  });

  await runTest('Wishlist clear', async () => {
    const res = await client.post('/listar/v1/wishlist/reset');
    assert.ok(res.data.success, 'Clear wishlist failed');
    return res.data.message;
  });

  if (ctx.listingSupportsBooking) {
    await runTest('Booking form', async () => {
      const res = await client.get('/listar/v1/booking/form', {
        params: { resource_id: ctx.listingId },
      });
      assert.ok(res.data.success, 'Booking form failed');
      ctx.bookingStyle = res.data.data?.type;
      return `type=${ctx.bookingStyle}`;
    });

    await runTest('Booking price', async () => {
      const res = await client.post('/listar/v1/booking/cart', {
        resource_id: ctx.listingId,
      });
      assert.ok(res.data.success, 'Booking price failed');
      return res.data.attr?.total_display;
    });

    await runTest('Booking order', async () => {
      const res = await client.post('/listar/v1/booking/order', {
        resource_id: ctx.listingId,
        payment_method: 'paypal',
        first_name: 'Demo',
        last_name: 'User',
        email: 'demo@example.com',
        phone: '+10000000000',
      });
      assert.ok(res.data.success, 'Booking order failed');
      ctx.bookingId = res.data.data?.id;
      return `bookingId=${ctx.bookingId}`;
    });

    await runTest('Booking list', async () => {
      const res = await client.get('/listar/v1/booking/list');
      assert.ok(res.data.success, 'Booking list failed');
      assert.ok(Array.isArray(res.data.data), 'data missing');
      assert.ok(res.data.data.some((item) => item.ID === ctx.bookingId), 'Booking missing');
      return `total=${res.data.data.length}`;
    });

    await runTest('Booking detail', async () => {
      const res = await client.get('/listar/v1/booking/view', {
        params: { id: ctx.bookingId },
      });
      assert.ok(res.data.success, 'Booking detail failed');
      assert.strictEqual(res.data.data?.ID, ctx.bookingId, 'Booking detail mismatch');
      return `status=${res.data.data?.status}`;
    });
  } else {
    results.push({
      name: 'Booking flow skipped',
      status: 'skip',
      duration: 0,
      detail: 'Selected listing does not support booking',
    });
  }

  await runTest('Submit claim', async () => {
    const res = await client.post('/listar/v1/claim/submit', {
      id: ctx.listingId,
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo@example.com',
      phone: '+10000000000',
      memo: 'Smoke test claim',
    });
    assert.ok(res.data.success, 'Claim submit failed');
    ctx.claimId = res.data.data?.id;
    return `claimId=${ctx.claimId}`;
  });

  await runTest('Claim list', async () => {
    const res = await client.get('/listar/v1/claim/list');
    assert.ok(res.data.success, 'Claim list failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    assert.ok(res.data.data.some((item) => item.id === ctx.claimId), 'Claim missing');
    return `total=${res.data.data.length}`;
  });

  await runTest('Listing comments', async () => {
    const res = await client.get('/listar/v1/comments', {
      params: { post_id: ctx.listingId },
    });
    assert.ok(res.data.success, 'Comment fetch failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    return `comments=${res.data.data.length}`;
  });

  await runTest('Submit comment', async () => {
    const res = await client.post('/wp/v2/comments', {
      post: ctx.listingId,
      content: `Great place! ${Date.now()}`,
      rating: 5,
    });
    assert.ok(res.data.success, 'Comment submit failed');
    ctx.commentId = res.data.id;
    return `commentId=${ctx.commentId}`;
  });

  await runTest('Author listings', async () => {
    const res = await client.get('/listar/v1/author/listing', {
      params: { user_id: ctx.userId, per_page: 5, page: 1 },
    });
    assert.ok(res.data.success, 'Author listing failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    return `items=${res.data.data.length}`;
  });

  await runTest('Author reviews', async () => {
    const res = await client.get('/listar/v1/author/comments', {
      params: { user_id: ctx.userId, per_page: 5, page: 1 },
    });
    assert.ok(res.data.success, 'Author reviews failed');
    assert.ok(Array.isArray(res.data.data), 'data missing');
    return `items=${res.data.data.length}`;
  });

  await runTest('Media upload', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'listar-'));
    const filePath = path.join(tmpDir, `upload-${crypto.randomUUID()}.png`);
    const base64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFgwJ/l1nV+wAAAABJRU5ErkJggg==';
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
    tempFiles.push(filePath);
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    const res = await client.post('/wp/v2/media', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: client.defaults.headers.common.Authorization,
      },
      maxBodyLength: Infinity,
    });
    assert.ok(res.data.id, 'Media upload failed');
    ctx.mediaId = res.data.id;
    return `mediaId=${ctx.mediaId}`;
  });

  await runTest('Submit listing', async () => {
    const title = `Test Listing ${Date.now()}`;
    const res = await client.post('/listar/v1/place/save', {
      title,
      content: 'Automated smoke test listing content',
      status: 'pending',
      booking_price: '99',
      price_min: '50',
      price_max: '150',
      latitude: '34.0522',
      longitude: '-118.2437',
    });
    assert.ok(res.data.success, 'Submit listing failed');
    ctx.newListingId = res.data.data?.id;
    assert.ok(ctx.newListingId, 'No listing id returned');
    return `listingId=${ctx.newListingId}`;
  });

  await runTest('Delete listing', async () => {
    const res = await client.post('/listar/v1/place/delete', { post_id: ctx.newListingId });
    assert.ok(res.data.success, 'Delete listing failed');
    return res.data.message;
  });

  await runTest('Author overview', async () => {
    const res = await client.get('/listar/v1/author/overview', {
      params: { user_id: ctx.userId },
    });
    assert.ok(res.data.success, 'Author overview failed');
    assert.ok(res.data.data?.id === ctx.userId, 'Overview mismatch');
    return `name=${res.data.data?.name}`;
  });

  printSummary();
  cleanup();

  if (failureCount > 0) {
    process.exitCode = 1;
  }
}

function printSummary() {
  console.log('\nAPI Smoke Test Summary');
  for (const item of results) {
    if (item.status === 'pass') {
      console.log(`✔ ${item.name} (${item.duration}ms)${item.detail ? ` - ${item.detail}` : ''}`);
    } else if (item.status === 'skip') {
      console.log(`~ ${item.name} - ${item.detail}`);
    } else {
      console.log(`✖ ${item.name} (${item.duration}ms) - ${item.error}`);
    }
  }
  const total = results.filter((item) => item.status !== 'skip').length;
  const passed = results.filter((item) => item.status === 'pass').length;
  console.log(`\nTotal: ${total}, Passed: ${passed}, Failed: ${failureCount}`);
}

function cleanup() {
  for (const filePath of tempFiles) {
    try {
      fs.unlinkSync(filePath);
      const dir = path.dirname(filePath);
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // ignore clean-up errors
    }
  }
}

main().catch((error) => {
  console.error('Smoke test encountered a fatal error:', error);
  cleanup();
  process.exitCode = 1;
});
