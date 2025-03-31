export default class HttpStatusCodes {

    /**
     * The request succeeded. The result meaning of "success" depends on the HTTP method
     */
    public static readonly OK: number = 200;
  
    /**
     * The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.
     */
    public static readonly CREATED: number = 201;
  
    /**
     * The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
     */
    public static readonly BAD_REQUEST: number = 400;
  
    /**
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    public static readonly UNAUTHORIZED: number = 401;
  
    /**
     * The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
     */
    public static readonly FORBIDDEN: number = 403;
  
    /**
     * The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
     */
    public static readonly NOT_FOUND: number = 404;
  
    /**
     * This response is sent when a request conflicts with the current state of the server.
     */
    public static readonly CONFLICT: number = 409;
  
    /**
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    public static readonly TOO_MANY_REQUESTS: number = 429;
  
    /**
     * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    public static readonly SERVICE_UNAVAILABLE: number = 503;
  
    /**
     * The server has encountered a situation it does not know how to handle.
     */
    public static readonly SERVER_ERROR: number = 500
  }