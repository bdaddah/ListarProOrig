import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ListarPro API',
      version: '1.0.0',
      description: 'REST API for ListarPro mobile app - WordPress compatible backend',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current server (relative)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development',
      },
      {
        url: 'http://192.168.42.1:3000',
        description: 'Network access',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            display_name: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            user_photo: { type: 'string', nullable: true },
            user_url: { type: 'string', nullable: true },
            user_level: { type: 'integer' },
            description: { type: 'string', nullable: true },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', description: 'Email address' },
            password: { type: 'string' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                id: { type: 'integer' },
                email: { type: 'string' },
                name: { type: 'string' },
                display_name: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                user_photo: { type: 'string', nullable: true },
                user_level: { type: 'integer' },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'first_name', 'last_name'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
          },
        },
        Listing: {
          type: 'object',
          properties: {
            ID: { type: 'integer' },
            post_title: { type: 'string' },
            post_excerpt: { type: 'string' },
            post_date: { type: 'string', format: 'date-time' },
            post_status: { type: 'string', enum: ['publish', 'pending', 'draft'] },
            image: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                full: { type: 'object', properties: { url: { type: 'string' } } },
                thumb: { type: 'object', properties: { url: { type: 'string' } } },
              },
            },
            category: { $ref: '#/components/schemas/Category' },
            author: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                user_photo: { type: 'string', nullable: true },
              },
            },
            rating_avg: { type: 'number' },
            rating_count: { type: 'integer' },
            address: { type: 'string' },
            phone: { type: 'string' },
            price_min: { type: 'string' },
            price_max: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            wishlist: { type: 'boolean' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            term_id: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' },
            icon: { type: 'string' },
            color: { type: 'string' },
            count: { type: 'integer' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            listing_id: { type: 'integer' },
            user_id: { type: 'integer' },
            status: { type: 'string', enum: ['pending', 'approved', 'completed', 'cancelled'] },
            total_price: { type: 'string' },
            payment_method: { type: 'string' },
            booking_date: { type: 'string', format: 'date' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            post_id: { type: 'integer' },
            user_id: { type: 'integer' },
            content: { type: 'string' },
            rate: { type: 'number', minimum: 1, maximum: 5 },
            created_at: { type: 'string', format: 'date-time' },
            author: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                user_photo: { type: 'string', nullable: true },
              },
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            ID: { type: 'integer' },
            post_title: { type: 'string' },
            post_content: { type: 'string' },
            post_excerpt: { type: 'string' },
            post_date: { type: 'string', format: 'date-time' },
            image: { type: 'string' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            per_page: { type: 'integer' },
            total: { type: 'integer' },
            total_pages: { type: 'integer' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Listings', description: 'Place/Listing management' },
      { name: 'Categories', description: 'Category and location management' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Comments', description: 'Reviews and comments' },
      { name: 'Wishlist', description: 'User favorites' },
      { name: 'Claims', description: 'Business claim requests' },
      { name: 'Posts', description: 'Blog posts' },
      { name: 'Media', description: 'File uploads' },
      { name: 'Settings', description: 'App settings' },
      { name: 'Home', description: 'Home screen data' },
    ],
    paths: {
      // Auth endpoints
      '/wp-json/jwt-auth/v1/token': {
        post: {
          tags: ['Auth'],
          summary: 'Login and get JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginResponse' },
                },
              },
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/wp-json/jwt-auth/v1/token/validate': {
        post: {
          tags: ['Auth'],
          summary: 'Validate JWT token',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Token is valid' },
            '401': { description: 'Invalid token' },
          },
        },
      },
      '/wp-json/listar/v1/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            '201': { description: 'User created successfully' },
            '400': { description: 'Validation error or email exists' },
          },
        },
      },
      '/wp-json/listar/v1/auth/reset_password': {
        post: {
          tags: ['Auth'],
          summary: 'Request password reset',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Reset email sent' },
            '404': { description: 'User not found' },
          },
        },
      },
      '/wp-json/listar/v1/auth/user': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User profile',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/wp-json/wp/v2/users/me': {
        post: {
          tags: ['Auth'],
          summary: 'Update user profile',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    first_name: { type: 'string' },
                    last_name: { type: 'string' },
                    url: { type: 'string' },
                    description: { type: 'string' },
                    image: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Profile updated' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      // Listing endpoints
      '/wp-json/listar/v1/place/list': {
        get: {
          tags: ['Listings'],
          summary: 'Get listings with filters',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'per_page', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 's', in: 'query', schema: { type: 'string' }, description: 'Search keyword' },
            { name: 'category', in: 'query', schema: { type: 'integer' }, description: 'Category ID' },
            { name: 'location', in: 'query', schema: { type: 'integer' }, description: 'Location ID' },
            { name: 'user', in: 'query', schema: { type: 'integer' }, description: 'Author user ID' },
            { name: 'orderby', in: 'query', schema: { type: 'string', enum: ['date', 'rating', 'title'] } },
            { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
          ],
          responses: {
            '200': {
              description: 'List of listings',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Listing' },
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/wp-json/listar/v1/place/view': {
        get: {
          tags: ['Listings'],
          summary: 'Get single listing details',
          parameters: [
            { name: 'id', in: 'query', required: true, schema: { type: 'integer' }, description: 'Listing ID' },
          ],
          responses: {
            '200': { description: 'Listing details' },
            '404': { description: 'Listing not found' },
          },
        },
      },
      '/wp-json/listar/v1/place/save': {
        post: {
          tags: ['Listings'],
          summary: 'Create or update listing',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', description: 'Listing ID (for update)' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    excerpt: { type: 'string' },
                    category_id: { type: 'integer' },
                    location_id: { type: 'integer' },
                    address: { type: 'string' },
                    phone: { type: 'string' },
                    email: { type: 'string' },
                    website: { type: 'string' },
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                    price_min: { type: 'string' },
                    price_max: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Listing saved' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/wp-json/listar/v1/place/delete': {
        post: {
          tags: ['Listings'],
          summary: 'Delete listing',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id'],
                  properties: {
                    id: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Listing deleted' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Listing not found' },
          },
        },
      },
      // Category endpoints
      '/wp-json/listar/v1/category/list': {
        get: {
          tags: ['Categories'],
          summary: 'Get all categories',
          responses: {
            '200': {
              description: 'List of categories',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Category' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/wp-json/listar/v1/location/list': {
        get: {
          tags: ['Categories'],
          summary: 'Get all locations',
          responses: {
            '200': { description: 'List of locations' },
          },
        },
      },
      // Booking endpoints
      '/wp-json/listar/v1/booking/form': {
        get: {
          tags: ['Bookings'],
          summary: 'Get booking form data for a listing',
          parameters: [
            { name: 'listing_id', in: 'query', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            '200': { description: 'Booking form data' },
          },
        },
      },
      '/wp-json/listar/v1/booking/cart': {
        post: {
          tags: ['Bookings'],
          summary: 'Calculate booking price',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    listing_id: { type: 'integer' },
                    booking_date: { type: 'string', format: 'date' },
                    quantity: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Price calculation' },
          },
        },
      },
      '/wp-json/listar/v1/booking/order': {
        post: {
          tags: ['Bookings'],
          summary: 'Create booking order',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Booking created' },
          },
        },
      },
      '/wp-json/listar/v1/booking/list': {
        get: {
          tags: ['Bookings'],
          summary: 'Get user bookings',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'List of bookings' },
          },
        },
      },
      // Comment endpoints
      '/wp-json/listar/v1/comments': {
        get: {
          tags: ['Comments'],
          summary: 'Get comments/reviews for a listing',
          parameters: [
            { name: 'post_id', in: 'query', required: true, schema: { type: 'integer' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          ],
          responses: {
            '200': { description: 'List of comments' },
          },
        },
        post: {
          tags: ['Comments'],
          summary: 'Add a comment/review',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['post_id', 'content', 'rate'],
                  properties: {
                    post_id: { type: 'integer' },
                    content: { type: 'string' },
                    rate: { type: 'number', minimum: 1, maximum: 5 },
                    parent: { type: 'integer', description: 'Parent comment ID for replies' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Comment added' },
          },
        },
      },
      // Wishlist endpoints
      '/wp-json/listar/v1/wishlist/list': {
        get: {
          tags: ['Wishlist'],
          summary: 'Get user wishlist',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Wishlist items' },
          },
        },
      },
      '/wp-json/listar/v1/wishlist/save': {
        post: {
          tags: ['Wishlist'],
          summary: 'Add item to wishlist',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['post_id'],
                  properties: {
                    post_id: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Added to wishlist' },
          },
        },
      },
      '/wp-json/listar/v1/wishlist/remove': {
        post: {
          tags: ['Wishlist'],
          summary: 'Remove item from wishlist',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['post_id'],
                  properties: {
                    post_id: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Removed from wishlist' },
          },
        },
      },
      // Claim endpoints
      '/wp-json/listar/v1/claim/submit': {
        post: {
          tags: ['Claims'],
          summary: 'Submit business claim',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['listing_id', 'message'],
                  properties: {
                    listing_id: { type: 'integer' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Claim submitted' },
          },
        },
      },
      '/wp-json/listar/v1/claim/list': {
        get: {
          tags: ['Claims'],
          summary: 'Get user claims',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'List of claims' },
          },
        },
      },
      // Post endpoints
      '/wp-json/listar/v1/post/home': {
        get: {
          tags: ['Posts'],
          summary: 'Get blog posts for home',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'per_page', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            '200': { description: 'List of posts' },
          },
        },
      },
      '/wp-json/listar/v1/post/view': {
        get: {
          tags: ['Posts'],
          summary: 'Get single post',
          parameters: [
            { name: 'id', in: 'query', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            '200': { description: 'Post details' },
            '404': { description: 'Post not found' },
          },
        },
      },
      // Media endpoints
      '/wp-json/wp/v2/media': {
        post: {
          tags: ['Media'],
          summary: 'Upload media file',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['file'],
                  properties: {
                    file: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'File uploaded' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      // Setting endpoints
      '/wp-json/listar/v1/setting/init': {
        get: {
          tags: ['Settings'],
          summary: 'Get app settings',
          responses: {
            '200': { description: 'App settings' },
          },
        },
      },
      '/wp-json/listar/v1/setting/payment': {
        get: {
          tags: ['Settings'],
          summary: 'Get payment settings',
          responses: {
            '200': { description: 'Payment configuration' },
          },
        },
      },
      // Home endpoints
      '/wp-json/listar/v1/home/init': {
        get: {
          tags: ['Home'],
          summary: 'Get home screen data',
          responses: {
            '200': { description: 'Home screen data with categories, featured listings, etc.' },
          },
        },
      },
      '/wp-json/listar/v1/home/widget': {
        get: {
          tags: ['Home'],
          summary: 'Get home widgets configuration',
          responses: {
            '200': { description: 'Widget configuration' },
          },
        },
      },
      // Health check
      '/health': {
        get: {
          tags: ['Settings'],
          summary: 'Health check endpoint',
          responses: {
            '200': {
              description: 'Server is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // We define paths inline above
};

export const swaggerSpec = swaggerJsdoc(options);
