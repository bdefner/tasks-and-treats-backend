export const spacing = {
  small: 8,
  medium_1: 16,
  medium_2: 24,
  medium_3: 32,
  large_1: 42,
  large_2: 48,
};

export const colors = {
  grey: '#b9babc',
  lightGrey: '#f2f3f6',
  black: '#2c2d2e',
  green_1: '#31D35F',
  green_2: '#64de87',
  green_3: '#97e9af',
  purple_1: '#8D40CA',
  purple_2: '#ba8bde',
  redAlert: '#ea3c59',
  greyBorder: '#e1e1e1',
  yellowStar: '#fdd800',
};

export const font = {
  size_1: 10,
  size_2: 16,
  size_3: 24,
  size_4: 32,
};

export const shadow = {
  shadowColor: '#333',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3,
  elevation: 5,
};

export const buttonStyles = StyleSheet.create({
  purplePrimary: {
    backgroundColor: colors.purple_1,
    borderRadius: 8,
    padding: spacing.small,
    paddingLeft: spacing.medium_1,
    paddingRight: spacing.medium_1,
  },
  greenPrimary: {
    backgroundColor: colors.green_1,
    borderRadius: 8,
    padding: spacing.small,
    paddingLeft: spacing.medium_1,
    paddingRight: spacing.medium_1,
  },
  greenSecondary: {
    borderColor: colors.green_1,
    color: colors.green_1,
    borderRadius: 8,
    paddingLeft: spacing.medium_1,
    paddingRight: spacing.medium_1,
  },
});
