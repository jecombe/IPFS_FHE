function generatePermutations(digits) {
    const result = [];
  
    function permute(current, remaining) {
      if (remaining.length === 0) {
        result.push(current);
        return;
      }
  
      for (let i = 0; i < remaining.length; i++) {
        const next = remaining.slice(0, i).concat(remaining.slice(i + 1));
        permute(current + remaining[i], next);
      }
    }
  
    permute('', digits);
    return result;
  }
  
  function checkDivisibility(arr) {
    const results = [];
  
    arr.forEach(numberString => {
      const permutations = generatePermutations(numberString);
      console.log(permutations);
      let divisible = permutations.some(perm => parseInt(perm, 10) % 8 === 0);
      results.push(divisible ? 'Yes': 'No');
    });
  
    return results;
  }
  
  // Exemple d'utilisation
  const inputArray = ['123', '456', '789'];
   const results = checkDivisibility(inputArray);
//   console.log(results);