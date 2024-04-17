export default {
  pages: [
    'pages/index/index',
    'pages/signin/index',
    'pages/account/index',
    'pages/report/index',
    'pages/sectionone/index',
    'pages/sectiontwo/index',
    'pages/updateuserinfo/index',
    'pages/updateuserpassword/index',
  ],
  tabBar: {
    custom: true,
    color: '#000',
    selectedColor: '#f00',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        selectedIconPath: 'assets/images/home-fill.png',
        iconPath: 'assets/images/home.png',
      },
      {
        pagePath: 'pages/sectionone/index',
        text: '教学管理',
        selectedIconPath: 'assets/images/school-fill.png',
        iconPath: 'assets/images/school.png',
      },
      {
        pagePath: 'pages/sectiontwo/index',
        text: '科研管理',
        selectedIconPath: 'assets/images/science-fill.png',
        iconPath: 'assets/images/science.png',
      },
      {
        pagePath: 'pages/report/index',
        text: '报告',
        selectedIconPath: 'assets/images/analytics-fill.png',
        iconPath: 'assets/images/analytics.png',
      },
      {
        pagePath: 'pages/account/index',
        text: '我的',
        selectedIconPath: 'assets/images/person-fill.png',
        iconPath: 'assets/images/person.png',
      },
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
