import React, { useEffect } from 'react';
import { Animated as RNAnimated, Easing } from 'react-native';

export const FadeIn = ({ children, duration = 300, delay = 0, style }) => {
  const opacity = new RNAnimated.Value(0);

  useEffect(() => {
    RNAnimated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <RNAnimated.View style={[{ opacity }, style]}>
      {children}
    </RNAnimated.View>
  );
};

export const SlideIn = ({
  children,
  duration = 300,
  delay = 0,
  from = 'bottom',
  distance = 50,
  style,
}) => {
  const translateY = new RNAnimated.Value(from === 'bottom' ? distance : -distance);
  const translateX = new RNAnimated.Value(
    from === 'right' ? distance : from === 'left' ? -distance : 0
  );
  const opacity = new RNAnimated.Value(0);

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      RNAnimated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      RNAnimated.timing(translateX, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <RNAnimated.View
      style={[
        {
          opacity,
          transform: [{ translateY }, { translateX }],
        },
        style,
      ]}
    >
      {children}
    </RNAnimated.View>
  );
};

export const Scale = ({
  children,
  duration = 300,
  delay = 0,
  initialScale = 0.9,
  style,
}) => {
  const scale = new RNAnimated.Value(initialScale);
  const opacity = new RNAnimated.Value(0);

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      RNAnimated.timing(scale, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <RNAnimated.View
      style={[
        {
          opacity,
          transform: [{ scale }],
        },
        style,
      ]}
    >
      {children}
    </RNAnimated.View>
  );
};

export const Stagger = ({ children, stagger = 50 }) => {
  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    return React.cloneElement(child, {
      delay: index * stagger,
    });
  });
};

// Example usage:
// <Stagger>
//   <FadeIn>
//     <Text>Item 1</Text>
//   </FadeIn>
//   <SlideIn from="right">
//     <Text>Item 2</Text>
//   </SlideIn>
//   <Scale>
//     <Text>Item 3</Text>
//   </Scale>
// </Stagger>
