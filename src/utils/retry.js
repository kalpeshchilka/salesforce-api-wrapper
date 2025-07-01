
/**
 * Basic async retry wrapper
 * @param {Function} fn - Function that returns a promise. Should return a truthy value when successful.
 * @param {number} maxRetries - Max number of retries
 * @param {number} interval - Wait time in ms between retries
 * @returns {Promise<*>} - Resolved value from fn, or throws error if all retries fail
 */
export const retry = async ({ fn, maxRetries = 5, interval = 1000 }) => {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const result = await fn();
        if (result) return result;
      } catch (err) {
        console.warn(`⚠️ Retry attempt ${attempt + 1} failed:`, err.message);
      }
  
      attempt++;
      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${interval}ms before retry ${attempt + 1}...`);
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }
  
    throw new Error(`❌ Failed after ${maxRetries} retries`);
  };
  