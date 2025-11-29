(() => {
  const API_BASE = '/wp-json';

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  const categoryForm = document.getElementById('category-form');
  const categoryFormError = document.getElementById('category-form-error');
  const refreshCategoriesBtn = document.getElementById('refresh-categories');
  const categoriesTableBody = document.getElementById('categories-table-body');
  const categoryFormTitle = document.getElementById('category-form-title');
  const categorySubmitBtn = document.getElementById('category-submit-btn');
  const categoryCancelEditBtn = document.getElementById('category-cancel-edit');

  const listingsTableBody = document.getElementById('listings-table-body');
  const refreshListingsBtn = document.getElementById('refresh-listings');
  const listingStatusFilter = document.getElementById('listing-status-filter');

  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  const toast = document.getElementById('toast');

  let authToken = sessionStorage.getItem('listarAdminToken') || '';
  let categoriesCache = [];
  let listingsCache = [];
  let editingCategoryId = null;

  const setAuthToken = (token) => {
    authToken = token;
    if (token) {
      sessionStorage.setItem('listarAdminToken', token);
    } else {
      sessionStorage.removeItem('listarAdminToken');
    }
  };

  const showToast = (message, variant = 'info') => {
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    toast.dataset.variant = variant;
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener(
        'transitionend',
        () => {
          toast.classList.add('hidden');
        },
        { once: true },
      );
    }, 2500);
  };

  const resetCategoryForm = () => {
    editingCategoryId = null;
    categoryForm.reset();
    categoryFormTitle.textContent = 'Add Category';
    categorySubmitBtn.textContent = 'Create Category';
    categoryCancelEditBtn.classList.add('hidden');
    categoryFormError.classList.add('hidden');
    if (categoryForm.elements['type']) {
      categoryForm.elements['type'].value = 'category';
    }
    if (categoryForm.elements['order']) {
      categoryForm.elements['order'].value =
        categoryForm.elements['order'].value || '0';
    }
  };

  const serializeCategoryPayload = (formData) => {
    const payload = {};
    formData.forEach((value, key) => {
      const trimmed = typeof value === 'string' ? value.trim() : value;
      if (key === 'slug') {
        if (trimmed) {
          payload.slug = trimmed;
        }
        return;
      }
      if (key === 'parent_id') {
        payload.parent_id = trimmed === '' ? null : trimmed;
        return;
      }
      if (key === 'order') {
        if (trimmed === '') {
          return;
        }
        payload.order = trimmed;
        return;
      }
      payload[key] = trimmed ?? '';
    });
    if (!payload.type) {
      payload.type = 'category';
    }
    return payload;
  };

  const populateCategoryForm = (category) => {
    categoryForm.elements['name'].value = category.name ?? '';
    categoryForm.elements['slug'].value = category.slug ?? '';
    categoryForm.elements['type'].value = category.type ?? 'category';
    categoryForm.elements['parent_id'].value =
      category.parent_id !== undefined && category.parent_id !== null
        ? String(category.parent_id)
        : '';
    categoryForm.elements['icon'].value = category.icon ?? '';
    categoryForm.elements['color'].value = category.color ?? '';
    categoryForm.elements['description'].value =
      category.description ?? '';
    const orderValue =
      category.order !== undefined && category.order !== null
        ? String(category.order)
        : '0';
    categoryForm.elements['order'].value = orderValue;
    const imageField = categoryForm.elements['image'];
    if (imageField) {
      const imageUrl =
        category.image?.full?.url ||
        category.image?.thumb?.url ||
        category.image?.medium?.url ||
        (typeof category.image === 'string' ? category.image : '');
      imageField.value = imageUrl ?? '';
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    } else if (headers.has('Authorization') && !headers.get('Authorization')) {
      headers.delete('Authorization');
    }
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const payload = await response.json();
        message = payload.message || payload.msg || message;
      } catch (err) {
        // ignore
      }
      throw new Error(message);
    }
    return response.json();
  };

  const toggleView = (isAuthenticated) => {
    if (isAuthenticated) {
      loginView.classList.add('hidden');
      dashboardView.classList.remove('hidden');
      logoutBtn.classList.remove('hidden');
    } else {
      loginView.classList.remove('hidden');
      dashboardView.classList.add('hidden');
      logoutBtn.classList.add('hidden');
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = loginForm.querySelector('#login-username').value.trim();
    const password = loginForm.querySelector('#login-password').value.trim();

    if (!username || !password) {
      loginError.textContent = 'Credentials are required';
      loginError.classList.remove('hidden');
      return;
    }

    loginError.classList.add('hidden');

    try {
      const payload = await fetchWithAuth(
        `${API_BASE}/jwt-auth/v1/token`,
        {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: { Authorization: '' }, // remove stale auth header if present
        },
      );

      if (!payload?.data?.token) {
        throw new Error('Missing token in response');
      }

      setAuthToken(payload.data.token);
      toggleView(true);
      resetCategoryForm();
      showToast(`Welcome back, ${payload.data.display_name || 'Admin'}!`);
      await Promise.all([loadCategories(false), loadListings(false)]);
    } catch (error) {
      setAuthToken('');
      loginError.textContent = error.message;
      loginError.classList.remove('hidden');
    }
  };

const handleLogout = () => {
  setAuthToken('');
  toggleView(false);
  loginForm.reset();
  resetCategoryForm();
  categoriesTableBody.innerHTML = '';
  listingsTableBody.innerHTML = '';
  categoriesCache = [];
  listingsCache = [];
};

  const renderCategories = (items) => {
    categoriesTableBody.innerHTML = '';
    if (!items.length) {
      categoriesTableBody.innerHTML =
        '<tr><td colspan="7">No categories found.</td></tr>';
      return;
    }

    items.forEach((cat) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cat.term_id}</td>
        <td>${cat.name}</td>
        <td>${cat.slug}</td>
        <td>${cat.type || 'category'}</td>
        <td>${cat.parent_id ?? ''}</td>
        <td>${cat.count ?? 0}</td>
        <td>
          <div class="actions">
            <button class="button button-secondary" data-action="edit">Edit</button>
            <button class="button button-danger" data-action="delete">Delete</button>
          </div>
        </td>
      `;

      row.querySelector('[data-action="edit"]').addEventListener('click', () =>
        openCategoryEdit(cat),
      );
      row
        .querySelector('[data-action="delete"]')
        .addEventListener('click', () => deleteCategory(cat));

      categoriesTableBody.appendChild(row);
    });
  };

  const loadCategories = async (showMessage = true) => {
    try {
      const response = await fetchWithAuth(
        `${API_BASE}/listar/v1/category/list`,
      );
      categoriesCache = response.data || [];
      renderCategories(categoriesCache);
      if (showMessage) {
        showToast('Categories refreshed', 'success');
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const createCategory = async (payload) => {
    try {
      if (!payload.name) {
        categoryFormError.textContent = 'Name is required';
        categoryFormError.classList.remove('hidden');
        return;
      }
      await fetchWithAuth(`${API_BASE}/listar/v1/category`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      showToast('Category created successfully', 'success');
      resetCategoryForm();
      await loadCategories(false);
    } catch (error) {
      categoryFormError.textContent = error.message;
      categoryFormError.classList.remove('hidden');
    }
  };

  const openCategoryEdit = (category) => {
    editingCategoryId = category.term_id;
    populateCategoryForm(category);
    categoryFormTitle.textContent = `Edit Category (${category.term_id})`;
    categorySubmitBtn.textContent = 'Update Category';
    categoryCancelEditBtn.classList.remove('hidden');
    categoryFormError.classList.add('hidden');
    categoryForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateCategory = async (id, payload) => {
    try {
      await fetchWithAuth(`${API_BASE}/listar/v1/category/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      showToast('Category updated', 'success');
      await loadCategories(false);
      resetCategoryForm();
    } catch (error) {
      categoryFormError.textContent = error.message;
      categoryFormError.classList.remove('hidden');
    }
  };

  const deleteCategory = async (category) => {
    const confirmed = confirm(
      `Delete category "${category.name}" (ID: ${category.term_id})?`,
    );
    if (!confirmed) return;

    try {
      await fetchWithAuth(`${API_BASE}/listar/v1/category/${category.term_id}`, {
        method: 'DELETE',
      });
      showToast('Category deleted', 'success');
      if (editingCategoryId === category.term_id) {
        resetCategoryForm();
      }
      await loadCategories(false);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const renderListings = (items) => {
    listingsTableBody.innerHTML = '';
    if (!items.length) {
      listingsTableBody.innerHTML =
        '<tr><td colspan="6">No listings found.</td></tr>';
      return;
    }

    items.forEach((listing) => {
      const row = document.createElement('tr');
      const author = listing.author?.name || 'Unknown';
      row.innerHTML = `
        <td>${listing.ID}</td>
        <td>${listing.post_title}</td>
        <td>
          <span class="status-pill ${listing.post_status}">
            ${listing.post_status}
          </span>
        </td>
        <td>${author}</td>
        <td>${new Date(listing.post_date).toLocaleString()}</td>
        <td>
          <div class="actions">
            <select class="status-select">
              <option value="publish" ${
                listing.post_status === 'publish' ? 'selected' : ''
              }>Publish</option>
              <option value="pending" ${
                listing.post_status === 'pending' ? 'selected' : ''
              }>Pending</option>
              <option value="draft" ${
                listing.post_status === 'draft' ? 'selected' : ''
              }>Draft</option>
            </select>
            <button class="button button-secondary" data-action="apply">
              Update
            </button>
            <button class="button button-danger" data-action="delete">
              Delete
            </button>
          </div>
        </td>
      `;

      const statusSelect = row.querySelector('.status-select');
      row
        .querySelector('[data-action="apply"]')
        .addEventListener('click', () =>
          updateListingStatus(listing.ID, statusSelect.value),
        );
      row
        .querySelector('[data-action="delete"]')
        .addEventListener('click', () => deleteListing(listing));

      listingsTableBody.appendChild(row);
    });
  };

  const loadListings = async (showMessage = true) => {
    const status = listingStatusFilter.value || 'all';
    const params = new URLSearchParams({
      take: '100',
      page: '1',
      post_status: status,
    });

    try {
      const response = await fetchWithAuth(
        `${API_BASE}/listar/v1/place/list?${params.toString()}`,
      );
      listingsCache = response.data || [];
      renderListings(listingsCache);
      if (showMessage) {
        showToast('Listings refreshed', 'success');
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const updateListingStatus = async (id, status) => {
    try {
      await fetchWithAuth(`${API_BASE}/listar/v1/admin/listings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      showToast('Listing status updated', 'success');
      await loadListings(false);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const deleteListing = async (listing) => {
    const confirmed = confirm(
      `Delete listing "${listing.post_title}" (ID: ${listing.ID})?`,
    );
    if (!confirmed) return;

    try {
      await fetchWithAuth(`${API_BASE}/listar/v1/admin/listings/${listing.ID}`, {
        method: 'DELETE',
      });
      showToast('Listing deleted', 'success');
      await loadListings(false);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const initTabs = () => {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        panels.forEach((panel) => panel.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.dataset.target;
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.add('active');
        }
      });
    });
  };

  loginForm.addEventListener('submit', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  refreshCategoriesBtn.addEventListener('click', () => loadCategories());
  refreshListingsBtn.addEventListener('click', () => loadListings());
  listingStatusFilter.addEventListener('change', () => loadListings(false));

  categoryForm.addEventListener('input', () => {
    categoryFormError.classList.add('hidden');
  });

  categoryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    categoryFormError.classList.add('hidden');
    const payload = serializeCategoryPayload(new FormData(categoryForm));
    if (editingCategoryId) {
      updateCategory(editingCategoryId, payload);
    } else {
      createCategory(payload);
    }
  });

  categoryCancelEditBtn.addEventListener('click', resetCategoryForm);

  resetCategoryForm();
  initTabs();

  // Auto-login if a token is already stored
  if (authToken) {
    toggleView(true);
    resetCategoryForm();
    Promise.all([loadCategories(false), loadListings(false)]).catch((error) => {
      showToast(error.message, 'error');
      handleLogout();
    });
  } else {
    toggleView(false);
    resetCategoryForm();
  }
})();
