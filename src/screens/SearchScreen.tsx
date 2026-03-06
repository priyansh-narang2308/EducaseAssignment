import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    TextInput,
    FlatList,
    ActivityIndicator,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import ProductItem from '../components/ProductItem';
import { Product } from '../types/product';
import { resetProducts, searchProducts, setSearchQuery } from '../store/productSlice';

const SearchScreen: React.FC = () => {
    const [localQuery, setLocalQuery] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error, searchQuery } = useSelector(
        (state: RootState) => state.products
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localQuery.trim() !== searchQuery) {
                dispatch(setSearchQuery(localQuery));
                if (localQuery.trim()) {
                    dispatch(searchProducts(localQuery));
                } else {
                    dispatch(resetProducts());
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localQuery, dispatch, searchQuery]);

    const renderItem = useCallback(({ item }: { item: Product }) => (
        <ProductItem product={item} />
    ), []);

    const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

    const clearSearch = () => {
        setLocalQuery('');
        dispatch(setSearchQuery(''));
        dispatch(resetProducts());
    };

    const ListEmptyComponent = useCallback(() => {
        if (loading) return null;
        if (!localQuery.trim()) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.infoText}>Start typing to search products...</Text>
                </View>
            );
        }
        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Search failed</Text>
                    <Text style={styles.errorSubText}>{error}</Text>
                </View>
            );
        }
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No results found for "{localQuery}"</Text>
            </View>
        );
    }, [loading, localQuery, error]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.searchHeader}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor="#8E8E93"
                        value={localQuery}
                        onChangeText={setLocalQuery}
                        autoFocus
                        clearButtonMode="always"
                        returnKeyType="search"
                    />
                    {localQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading && items.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={ListEmptyComponent}
                    contentContainerStyle={[
                        styles.listContent,
                        items.length === 0 ? styles.flex1 : null
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    searchHeader: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9E9EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        fontSize: 17,
        color: '#000000',
        paddingVertical: 8,
    },
    clearButton: {
        padding: 4,
    },
    clearButtonText: {
        color: '#8E8E93',
        fontSize: 18,
        fontWeight: '600',
    },
    listContent: {
        paddingTop: 16,
        paddingBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    infoText: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
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
        textAlign: 'center',
        marginBottom: 16,
    },
    flex1: {
        flex: 1,
    },
});

export default SearchScreen;
