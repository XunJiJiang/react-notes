const isMobile = () =>
  /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export default isMobile;
