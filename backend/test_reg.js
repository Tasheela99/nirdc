const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
    try {
        // 1. Get a session ID
        console.log("Getting session...");
        const resSession = await axios.post('http://localhost:5000/api/v1/reviewer-registration/start-session');
        const sessionId = resSession.data.sessionId;
        console.log("Session:", sessionId);
        
        // 2. Complete steps
        const steps = ['whoIsReviewer', 'qualifications', 'conditions', 'trainingVideo', 'mcq', 'nda'];
        for (const step of steps) {
            await axios.post(`http://localhost:5000/api/v1/reviewer-registration/${sessionId}/complete-step`, { step });
        }
        
        // 3. Register
        const form = new FormData();
        form.append('firstName', 'Test');
        form.append('lastName', 'User');
        form.append('designation', 'Dr');
        form.append('institution', 'Test Inst');
        form.append('mobile', '+94711234567');
        form.append('email', 'test_' + Date.now() + '@example.com');
        form.append('country', 'Sri Lanka');
        form.append('password', 'Test@1234');
        form.append('confirmPassword', 'Test@1234');
        
        form.append('areasOfExpertise', JSON.stringify(['Engineering & Technology']));
        form.append('sessionId', sessionId);
        form.append('mcqScore', '10');
        form.append('videoCompleted', 'true');
        form.append('agreedToGuidelines', 'true');
        
        // Mock a file for CV
        fs.writeFileSync('dummy_cv.pdf', 'dummy content');
        form.append('cv', fs.createReadStream('dummy_cv.pdf'));

        console.log("Sending registration request...");
        const resReg = await axios.post('http://localhost:5000/api/v1/users/register-reviewer', form, {
            headers: form.getHeaders()
        });
        console.log("Success:", resReg.data);
    } catch (error) {
        console.log("Error status:", error.response?.status);
        console.log("Error data:", error.response?.data);
        console.log("Error message:", error.message);
    } finally {
        if(fs.existsSync('dummy_cv.pdf')) fs.unlinkSync('dummy_cv.pdf');
    }
}

test();
