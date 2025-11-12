import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;
const ACTIVE_TAB_SIZE = 60; // Increased from 56
const CURVE_HEIGHT = 20;

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const { colors, typography } = useTheme();
    const tabWidth = width / state.routes.length;
    const activeTabIndex = state.index;

    // Circle position
    const circleTranslateX = useRef(new Animated.Value(activeTabIndex * tabWidth + tabWidth / 2 - ACTIVE_TAB_SIZE / 2)).current;

    // Icon positions and scales for each tab (relative to tab center)
    const iconTranslateX = useRef(state.routes.map(() => new Animated.Value(0))).current;
    const iconTranslateY = useRef(state.routes.map(() => new Animated.Value(0))).current;
    const iconScales = useRef(state.routes.map(() => new Animated.Value(1))).current;

    useEffect(() => {
        const circleCenterX = activeTabIndex * tabWidth + tabWidth / 2;
        const circleX = circleCenterX - ACTIVE_TAB_SIZE / 2;
        const circleY = -ACTIVE_TAB_SIZE / 2; // Circle is positioned above the tab bar

        // Animate all icons
        const iconAnimations = state.routes.map((_, index) => {
            const isActive = index === activeTabIndex;
            const tabCenterX = index * tabWidth + tabWidth / 2;

            // Calculate target positions (relative to tab center)
            const targetX = isActive ? circleCenterX - tabCenterX : 0;
            const targetY = isActive ? circleY : 0;
            const targetScale = isActive ? 1.4 : 1;

            return Animated.parallel([
                Animated.spring(iconTranslateX[index], {
                    toValue: targetX,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8
                }),
                Animated.spring(iconTranslateY[index], {
                    toValue: targetY,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8
                }),
                Animated.spring(iconScales[index], {
                    toValue: targetScale,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 7
                })
            ]);
        });

        Animated.parallel([
            // Animate circle position
            Animated.spring(circleTranslateX, {
                toValue: circleX,
                useNativeDriver: true,
                tension: 68,
                friction: 8
            }),
            ...iconAnimations
        ]).start();
    }, [activeTabIndex, tabWidth]);

    const iconForRoute = (routeName, focused) => {
        const icons = {
            Home: focused ? 'home' : 'home-outline',
            Handbook: focused ? 'book' : 'book-outline',
            Clubs: focused ? 'people' : 'people-outline',
            AskAI: focused ? 'chatbubbles' : 'chatbubbles-outline',
            Notifications: focused ? 'notifications' : 'notifications-outline',
            Profile: focused ? 'person' : 'person-outline'
        };
        return icons[routeName] ?? 'ellipse';
    };

    const onPress = (route, index) => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
        });

        if (state.index !== index && !event.defaultPrevented) {
            navigation.navigate(route.name);
        }
    };

    return (
        <View style={styles.container}>
            {/* Bottom section */}
            <View style={[styles.bottomSection, { backgroundColor: colors.primary }]}>
                {/* Active tab indicator (floating circle) */}
                <Animated.View
                    style={[
                        styles.activeTabIndicator,
                        {
                            transform: [
                                { translateX: circleTranslateX }
                            ],
                            backgroundColor: colors.primary
                        }
                    ]}
                />

                {/* Tab buttons with animated icons */}
                <View style={styles.tabsContainer}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;
                        const iconName = iconForRoute(route.name, true); // Always use filled icon for animation
                        const tabCenterX = index * tabWidth + tabWidth / 2;

                        return (
                            <TouchableOpacity
                                key={route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={() => onPress(route, index)}
                                style={styles.tabButton}
                                activeOpacity={0.7}
                            >
                                <Animated.View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            transform: [
                                                { translateX: iconTranslateX[index] },
                                                { translateY: iconTranslateY[index] },
                                                { scale: iconScales[index] }
                                            ]
                                        }
                                    ]}
                                >
                                    <Ionicons
                                        name={iconName}
                                        size={isFocused ? 24 : 22}
                                        color="#FFFFFF"
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT
    },
    bottomSection: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        overflow: 'visible'
    },
    activeTabIndicator: {
        position: 'absolute',
        width: ACTIVE_TAB_SIZE,
        height: ACTIVE_TAB_SIZE,
        borderRadius: ACTIVE_TAB_SIZE / 2,
        top: -ACTIVE_TAB_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5
    },
    activeTabContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
        overflow: 'visible',
        zIndex: 20
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        position: 'relative',
        overflow: 'visible',
        zIndex: 20
    },
    iconContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        zIndex: 25
    }
});

export default CustomTabBar;
