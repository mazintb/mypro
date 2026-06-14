export const DARK = {
  bg:'#040b19', surface:'#091828', surface2:'#0d2038',
  border:'#1a3352', borderGold:'#c9a84c26',
  gold:'#c9a84c', goldLight:'#e2c97a', goldDark:'#8a6500',
  text:'#edf5ff', textMuted:'#5f7fa6', textDim:'#2c4a6a',
  success:'#30d158', danger:'#ff453a', warning:'#ffd60a', info:'#0a84ff',
  purple:'#bf5af2', teal:'#5ac8fa',
  tabBar:'rgba(4,11,25,0.88)', inputBg:'#0b1b30',
  cardShadow:'0 1px 0 rgba(255,255,255,0.05) inset, 0 12px 40px -8px rgba(0,0,0,0.7)',
  glassCard:'rgba(255,255,255,0.03)', glassBorder:'rgba(255,255,255,0.07)',
  headerBg:'rgba(4,11,25,0.88)',
};

export const LIGHT = {
  bg:'#f2f2f7', surface:'#ffffff', surface2:'#f2f2f7',
  border:'#e0e0e8', borderGold:'#9A6E0D44',
  gold:'#8a6500', goldLight:'#b88200', goldDark:'#5c4400',
  text:'#1c1c1e', textMuted:'#636366', textDim:'#aeaeb2',
  success:'#1c8a38', danger:'#d4261a', warning:'#c05400', info:'#0060ce',
  purple:'#8944ab', teal:'#0089a0',
  tabBar:'rgba(242,242,247,0.92)', inputBg:'#f0f0f5',
  cardShadow:'0 1px 0 rgba(255,255,255,0.8) inset, 0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
  glassCard:'rgba(255,255,255,0.95)', glassBorder:'rgba(0,0,0,0.06)',
  headerBg:'rgba(242,242,247,0.92)',
};

export function useTheme(isDark){ return isDark?DARK:LIGHT; }
