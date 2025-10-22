// src/styles/styled.d.ts
import 'styled-components';
import { CustomTheme } from './GlobalStyles';

// 扩展 styled-components 默认的 DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme extends CustomTheme {} // 使用 CustomTheme 扩展 DefaultTheme
}
