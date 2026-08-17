const { extractFileNameFromUrl } = require('../utils/FileUploadAwsUtil');

// Test cases for URL extraction
const testCases = [
    {
        url: 'https://mybucket.s3.us-east-1.amazonaws.com/news-images/123456789-test.jpg',
        expected: 'news-images/123456789-test.jpg'
    },
    {
        url: 'https://mybucket.s3.amazonaws.com/announcements/test-file.pdf',
        expected: 'announcements/test-file.pdf'
    },
    {
        url: 'https://s3.amazonaws.com/mybucket/blogs/image.png',
        expected: 'blogs/image.png'
    },
    {
        url: 'https://s3-us-west-2.amazonaws.com/mybucket/folder/image.png',
        expected: 'folder/image.png'
    },
    {
        url: '',
        expected: null
    },
    {
        url: null,
        expected: null
    },
    {
        url: 'invalid-url',
        expected: null
    }
];

console.log('Testing AWS URL extraction...\n');

testCases.forEach((testCase, index) => {
    const result = extractFileNameFromUrl(testCase.url);
    const passed = result === testCase.expected;
    
    console.log(`Test ${index + 1}: ${passed ? 'PASSED' : 'FAILED'}`);
    console.log(`  URL: ${testCase.url}`);
    console.log(`  Expected: ${testCase.expected}`);
    console.log(`  Got: ${result}`);
    console.log('');
});

console.log('Test completed!');
