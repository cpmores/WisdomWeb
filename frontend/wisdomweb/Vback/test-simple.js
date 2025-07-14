/**
 * 简化虚拟后端测试脚本
 */

const BASE_URL = 'http://localhost:8080';

// 测试函数
const testHealthCheck = async () => {
  console.log('测试健康检查...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ 健康检查通过:', data);
    return true;
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
    return false;
  }
};

const testLogin = async () => {
  console.log('测试用户登录...');
  try {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ 登录成功:', data.message);
      return data.token;
    } else {
      console.log('❌ 登录失败:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ 登录请求失败:', error.message);
    return null;
  }
};

const testGetBookmarks = async (token) => {
  console.log('测试获取收藏...');
  try {
    const response = await fetch(`${BASE_URL}/api/bookmarks/listAll`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ 获取收藏成功:', data.message);
      return true;
    } else {
      console.log('❌ 获取收藏失败:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ 获取收藏请求失败:', error.message);
    return false;
  }
};

// 主测试函数
const runTests = async () => {
  console.log('开始测试简化虚拟后端...\n');
  
  // 测试健康检查
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ 服务未启动，请先启动虚拟后端服务');
    return;
  }
  
  console.log('');
  
  // 测试登录
  const token = await testLogin();
  if (!token) {
    console.log('\n❌ 登录失败，无法继续测试');
    return;
  }
  
  console.log('');
  
  // 测试获取收藏
  await testGetBookmarks(token);
  
  console.log('\n🎉 测试完成！');
};

// 运行测试
runTests().catch(console.error); 