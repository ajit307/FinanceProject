const http = require('http');

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        body: body ? JSON.parse(body) : body,
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        body: body,
                        headers: res.headers
                    });
                }
            });
        });
        
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function testAPI() {
    console.log('🧪 Testing Finance Backend API\n');
    
    try {
        // Test 1: Register a new user
        console.log('1️⃣  Testing User Registration...');
        const registerRes = await makeRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'analyst'
        });
        console.log('Status:', registerRes.status);
        console.log('Response:', registerRes.body);
        const userId = registerRes.body.id;
        
        // Test 2: Login
        console.log('\n2️⃣  Testing User Login...');
        const loginRes = await makeRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            email: 'john@example.com',
            password: 'password123'
        });
        console.log('Status:', loginRes.status);
        console.log('Token received:', loginRes.body.token ? 'Yes ✅' : 'No ❌');
        const token = loginRes.body.token;
        
        // Test 3: Create a record
        console.log('\n3️⃣  Testing Create Record...');
        const createRes = await makeRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/records',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, {
            amount: 1500,
            type: 'income',
            category: 'salary',
            date: new Date().toISOString(),
            notes: 'Monthly salary'
        });
        console.log('Status:', createRes.status);
        console.log('Record created:', createRes.body.id ? 'Yes ✅' : 'No ❌');
        
        // Test 4: Get records
        console.log('\n4️⃣  Testing Get Records...');
        const getRes = await makeRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/records',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Status:', getRes.status);
        console.log('Records retrieved:', Array.isArray(getRes.body) ? `${getRes.body.length} records ✅` : 'Error ❌');
        
        // Test 5: Get dashboard summary
        console.log('\n5️⃣  Testing Dashboard Summary...');
        const dashRes = await makeRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/dashboard',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Status:', dashRes.status);
        console.log('Summary:', dashRes.body);
        
        console.log('\n✅ All tests completed!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAPI();
