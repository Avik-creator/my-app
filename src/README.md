## NGINX Configuration Explained

This configuration sets up an NGINX server to act as a reverse proxy, routing requests to a backend server pool with load balancing and failover capabilities.

### `upstream backend`

```nginx
upstream backend {
    server localhost:3000;
    server localhost:9000 backup;
}
```

- **`upstream backend { ... }`**: Defines a group of backend servers under the name `backend`.
- **`server localhost:3000;`**: Specifies a primary server at `localhost` on port `3000`.
- **`server localhost:9000 backup;`**: Specifies a secondary server at `localhost` on port `9000` as a `backup`. The backup server is only used if the primary server is unavailable.

### `server { ... }`

```nginx
server {
    listen       9003;
    server_name  localhost;
```

- **`server { ... }`**: Defines a server block, which contains the configuration for a virtual server.
- **`listen 9003;`**: Instructs NGINX to listen on port `9003` for incoming requests.
- **`server_name localhost;`**: Specifies that this server block should handle requests for `localhost`.

### `location / { ... }`

```nginx
    location / {
        proxy_pass http://backend;
        add_header Cache-Control no-store;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- **`location / { ... }`**: Defines a location block that matches all requests to the root (`/`) path. In this context, it applies to all incoming requests.
- **`proxy_pass http://backend;`**: Forwards requests to the `backend` upstream server group defined earlier. NGINX load balances between the servers, using the primary first and failing over to the backup if needed.
- **`add_header Cache-Control no-store;`**: Adds an HTTP header to the response that prevents caching by setting `Cache-Control` to `no-store`.
- **`proxy_set_header Host $host;`**: Passes the original `Host` header from the client request to the backend server.
- **`proxy_set_header X-Real-IP $remote_addr;`**: Passes the real IP address of the client to the backend server in the `X-Real-IP` header.
- **`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`**: Adds the client’s IP address to the `X-Forwarded-For` header, which contains a list of all proxies the request has passed through.
- **`proxy_set_header X-Forwarded-Proto $scheme;`**: Passes the original protocol (`http` or `https`) used by the client to the backend server in the `X-Forwarded-Proto` header.
