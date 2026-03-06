import React, { useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    Text,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { Product, ProductState } from '../types/product';
import { fetchProducts, resetProducts } from '../store/productSlice';
import ProductItem from '../components/ProductItem';


const HomeScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();

    const { items, loading, error, hasMore, skip, limit } = useSelector(
        (state: RootState) => state.products as ProductState
    );

    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadProducts = useCallback(() => {
        if (!loading && hasMore) {
            dispatch(fetchProducts({ skip, limit }));
        }
    }, [dispatch, loading, hasMore, skip, limit]);

    const onRefresh = useCallback(() => {
        dispatch(resetProducts());
        dispatch(fetchProducts({ skip: 0, limit }));
    }, [dispatch, limit]);

    const renderItem = useCallback(({ item }: { item: Product }) => (
        <ProductItem product={item} />
    ), []);

    const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

    const ListFooterComponent = useCallback(() => {
        if (!loading) return null;
        return (
            <View style={styles.footerContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
            </View>
        );
    }, [loading]);

    const ListEmptyComponent = useCallback(() => {
        if (loading) return null;
        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Oops! Something went wrong.</Text>
                    <Text style={styles.errorSubText}>{error}</Text>
                    <Text style={styles.retryButton} onPress={onRefresh}>
                        Tap to retry
                    </Text>
                </View>
            );
        }
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No products found.</Text>
            </View>
        );
    }, [loading, error, onRefresh]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover Products</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Search' as never)}
                    activeOpacity={0.7}
                    style={styles.searchButton}
                >
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReached={loadProducts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={ListFooterComponent}
                ListEmptyComponent={ListEmptyComponent}
                refreshControl={
                    <RefreshControl refreshing={loading && skip === 0} onRefresh={onRefresh} tintColor="#007AFF" />
                }
                contentContainerStyle={[
                    styles.listContent,
                    items.length === 0 ? styles.flex1 : null
                ]}
                showsVerticalScrollIndicator={false}
                // Performance optimizations
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // iOS grouped background color
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1C1C1E',
        letterSpacing: 0.35,
    },
    searchButton: {
        padding: 8,
        backgroundColor: '#F2F2F7',
        borderRadius: 20,
    },
    searchIcon: {
        fontSize: 20,
    },
    listContent: {
        paddingTop: 16,
        paddingBottom: 24,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    footerContainer: {
        paddingVertical: 20,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        textAlign: 'center',
        marginBottom: 8,
    },
    errorSubText: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
        fontWeight: '500',
        textAlign: 'center',
    },
    flex1: {
        flex: 1,
    },
});

export default HomeScreen;
