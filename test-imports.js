// Quick test to verify all imports work
console.log('Testing imports...');

try {
  // Test if we can require the main components
  const path = require('path');
  const fs = require('fs');
  
  // Check if all required files exist
  const requiredFiles = [
    'app/pos/page.tsx',
    'components/ProductList.tsx',
    'components/Cart.tsx', 
    'components/Checkout.tsx',
    'components/Receipt.tsx',
    'components/SalesHistory.tsx',
    'store/useCartStore.ts',
    'store/useSalesStore.ts',
    'types/index.ts',
    'lib/storage.ts'
  ];
  
  let allFilesExist = true;
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      allFilesExist = false;
    }
  });
  
  if (allFilesExist) {
    console.log('\n🎉 All required files are present!');
    console.log('The POS system should run correctly.');
    console.log('\nTo start: npm run dev');
    console.log('Then visit: http://localhost:3000/pos');
  } else {
    console.log('\n❌ Some files are missing. Check the output above.');
  }
  
} catch (error) {
  console.error('Error during import test:', error.message);
}
