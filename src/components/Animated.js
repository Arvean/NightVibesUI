import React, { useEffect } from 'react';
import { Animated as RNAnimated, Easing } from 'react-native';

/**
 * This file provides a set of reusable animation components using React Native's Animated API.
 * These components can be used to easily add common animations like fade-in, slide-in, and scaling to UI elements.
 */

/**
 * FadeIn Component:
 * Fades in the wrapped children components.
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The content to be animated.
 * @param {number} [props.duration=300] - The animation duration in milliseconds.
 * @param {number} [props.delay=0] - The delay before the animation starts in milliseconds.
 * @param {object} [props.style] - Additional styles to apply to the animated view.
 */
export const FadeIn = ({ children, duration = 300, delay = 0, style }) => {
  const opacity = new RNAnimated.Value(0);

  useEffect(() => {
    RNAnimated.timing(opacity, {
      toValue: 1, // Fade to fully opaque
      duration,
      delay,
      easing: Easing.out(Easing.quad), // Use a quadratic easing function
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, []);

  return (
    <RNAnimated.View style={[{ opacity }, style]}>
      {children}
    </RNAnimated.View>
  );
};

/**
 * SlideIn Component:
 * Slides in the wrapped children components from a specified direction.
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The content to be animated.
 * @param {number} [props.duration=300] - The animation duration in milliseconds.
 * @param {number} [props.delay=0] - The delay before the animation starts in milliseconds.
 * @param {string} [props.from='bottom'] - The direction to slide in from ('bottom', 'top', 'left', 'right').
 * @param {number} [props.distance=50] - The distance to slide in from.
 * @param {object} [props.style] - Additional styles to apply to the animated view.
 */
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
        toValue: 0, // Slide to original position
        duration,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      RNAnimated.timing(translateX, {
        toValue: 0, // Slide to original position
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

/**
 * Scale Component:
 * Scales the wrapped children components from an initial scale to 1.
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The content to be animated.
 * @param {number} [props.duration=300] - The animation duration in milliseconds.
 * @param {number} [props.delay=0] - The delay before the animation starts in milliseconds.
 * @param {number} [props.initialScale=0.9] - The initial scale of the component.
 * @param {object} [props.style] - Additional styles to apply to the animated view.
 */
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
        toValue: 1, // Scale to normal size
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

/**
 * Stagger Component:
 * Staggers the animation of child components by applying a delay to each one.
 * @param {object} props - The component's props.
 * @param {ReactNode[]} props.children - The child components to stagger.
 * @param {number} [props.stagger=50] - The delay between each child's animation in milliseconds.
 */
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
