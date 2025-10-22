// src/styles/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';

// 直接定义 CustomTheme，避免继承 DefaultTheme
export interface CustomTheme {
  colors: {
    danger: string;
    primary: string;
    primaryHover: string;
    primaryActive: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    backgroundSecondary: string;
    backgroundDisabled: string;
    backgroundLight: string;
    border: string;
    borderSecondary: string;
    overlay: string;
    text: string;
    textSecondary: string;
    textDisabled: string;
    textPrimary: string;
    white: string;
    black: string;
  };
  fontSizes: {
    large: string;
    medium: string;
    small: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    xxxl: string;
  };
  fontWeights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    xxxl: string;
  };
  borderRadius: {
    medium: string;
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    round: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  zIndex: {
    base: number;
    dropdown: number;
    sticky: number;
    fixed: number;
    modalBackdrop: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

export const lightTheme: CustomTheme = {
  colors: {
    danger: '#f5222d', // red for danger
    primary: '#1890ff',
    primaryHover: '#40a9ff',
    primaryActive: '#096dd9',
    secondary: '#722ed1', // purple for secondary
    success: '#52c41a', // green for success
    warning: '#faad14', // yellow for warning
    error: '#f5222d', // red for error
    background: '#ffffff', // light background color
    backgroundSecondary: '#fafafa',
    backgroundDisabled: '#f5f5f5',
    backgroundLight: '#f0f0f0', // lighter background
    border: '#d9d9d9', // light gray border
    borderSecondary: '#f0f0f0',
    overlay: 'rgba(0, 0, 0, 0.5)', // semi-transparent overlay
    text: '#262626', // primary text color
    textSecondary: '#595959', // secondary text color
    textDisabled: '#bfbfbf',
    textPrimary: '#333333', // darker primary text
    white: '#ffffff', // white
    black: '#000000', // black
  },
  fontSizes: {
    large: '22px',
    medium: '18px',
    small: '14px',
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  borderRadius: {
    none: '0',            // 无边框圆角
    sm: '2px',            // 小的圆角
    medium: '4px',        // 中等圆角，新增的
    md: '6px',            // 默认的中等圆角
    lg: '8px',            // 较大的圆角
    xl: '12px',           // 超大的圆角
    round: '50%',         // 圆形
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  transitions: {
    fast: '0.1s',
    normal: '0.3s',
    slow: '0.5s',
  },
};

export const darkTheme: CustomTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#141414', // dark background
    backgroundSecondary: '#1f1f1f',
    backgroundDisabled: '#262626',
    border: '#434343',
    borderSecondary: '#303030',
    text: '#ffffff', // white text for dark mode
    textSecondary: '#a6a6a6',
    textDisabled: '#595959',
    textPrimary: '#f0f0f0', // lighter text for contrast
    primary: '#177ddc',
    primaryHover: '#3c9ae8',
    primaryActive: '#0958d9',
  },
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    color: #333;
    background-color: #fff;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }
  
  ul, ol {
    list-style: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  .ant-layout {
    background: transparent;
  }
  
  .ant-layout-header {
    padding: 0;
  }
  
  .ant-layout-footer {
    padding: 0;
  }
`;