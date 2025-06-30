
export const getCurrentUrl = () => {
  // Get the current URL from window.location
  const currentUrl = window.location.href;
  console.log('Current full URL:', currentUrl);
  
  // Extract protocol, hostname, and port
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port || (protocol === 'https:' ? '443' : '80');
  
  console.log('URL components:', { protocol, hostname, port });
  
  // For development, use the detected port
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:${port}`;
  }
  
  // For production, use origin
  return window.location.origin;
};

export const getRedirectUrl = () => {
  const baseUrl = getCurrentUrl();
  const redirectUrl = `${baseUrl}/auth?mode=reset`;
  console.log('Generated redirect URL:', redirectUrl);
  return redirectUrl;
};
