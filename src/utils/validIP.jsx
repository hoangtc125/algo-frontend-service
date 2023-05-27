export const validateIP = (ipAddress) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/; // Regex pattern for IP address
  
    if (ipRegex.test(ipAddress)) {
      const octets = ipAddress.split('.'); // Split the IP address into octets
  
      // Check if each octet is a valid number between 0 and 255
      for (let i = 0; i < 4; i++) {
        const octet = parseInt(octets[i]);
        if (isNaN(octet) || octet < 0 || octet > 255) {
          return false; // Invalid octet
        }
      }
  
      return true; // Valid IP address
    }
  
    return false; // Invalid IP address format
  }
  