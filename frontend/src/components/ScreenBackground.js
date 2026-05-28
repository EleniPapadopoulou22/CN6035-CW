import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export default function ScreenBackground({ children, center = false }) {
  return (
    <View style={styles.root}>
      <View style={styles.leftCurtain} />
      <View style={styles.rightCurtain} />
      <View style={styles.topLight} />
      <View style={[styles.content, center && styles.center]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  leftCurtain: {
    position: 'absolute',
    left: -80,
    top: -60,
    bottom: -60,
    width: 170,
    backgroundColor: colors.primaryDark,
    opacity: 0.28,
    transform: [{ rotate: '-7deg' }],
  },
  rightCurtain: {
    position: 'absolute',
    right: -90,
    top: -80,
    bottom: -80,
    width: 180,
    backgroundColor: colors.primary,
    opacity: 0.16,
    transform: [{ rotate: '7deg' }],
  },
  topLight: {
    position: 'absolute',
    top: 0,
    left: 30,
    right: 30,
    height: 2,
    backgroundColor: colors.primaryLight,
    opacity: 0.75,
  },
  content: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});