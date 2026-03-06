import React, { useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';

import { RootStackParamList } from '../types/navigation';
import { fetchProductsById, resetSelectedProduct } from '../store/productSlice';

const { width } = Dimensions.get('window');

const DetailsScreen: React.FC = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
    const { productId } = route.params;
    const dispatch = useDispatch<AppDispatch>();

    const { selectedProduct, items, loading, error } = useSelector(
        (state: RootState) => state.products
    );

    const product = selectedProduct || items.find((p) => p.id === productId);

    useEffect(() => {
        dispatch(fetchProductsById(productId));

        return () => {
            dispatch(resetSelectedProduct());
        };
    }, [dispatch, productId]);

    if (loading && !product) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error && !product) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error loading product</Text>
                <Text style={styles.errorSubText}>{error}</Text>
            </View>
        );
    }

    if (!product) return null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                    source={{ uri: product.thumbnail }}
                    style={styles.image}
                    resizeMode="cover"
                />

                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.category}>{product.category}</Text>
                        <Text style={styles.title}>{product.title}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>${product.price}</Text>
                            {product.discountPercentage > 0 && (
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>
                                        -{Math.round(product.discountPercentage)}% OFF
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Rating</Text>
                            <Text style={styles.statValue}>★ {product.rating}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Brand</Text>
                            <Text style={styles.statValue}>{product.brand}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Stock</Text>
                            <Text style={styles.statValue}>{product.stock}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

          
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    image: {
        width: width,
        height: width * 0.8,
        backgroundColor: '#F2F2F7',
    },
    contentContainer: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    category: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1C1C1E',
        marginBottom: 12,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1C1C1E',
        marginRight: 12,
    },
    discountBadge: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginVertical: 10,
    },
    section: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#3A3A3C',
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 16,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    errorText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    errorSubText: {
        fontSize: 14,
        color: '#8E8E93',
    },
    footer: {
        padding: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#C6C6C8',
        backgroundColor: '#FFFFFF',
    },
    buyButton: {
        backgroundColor: '#007AFF',
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default DetailsScreen;
