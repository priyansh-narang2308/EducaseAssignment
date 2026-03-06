import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../types/product';

const { width } = Dimensions.get('window');

interface ProductItemProps {
    product: Product;
}

const ProductItem: React.FC<ProductItemProps> = React.memo(({ product }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('Details', { productId: product.id })}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: product.thumbnail }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.infoContainer}>
                <Text style={styles.brand} numberOfLines={1}>
                    {product.brand}
                </Text>
                <Text style={styles.title} numberOfLines={2}>
                    {product.title}
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${product.price}</Text>
                    {product.discountPercentage > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>
                                -{Math.round(product.discountPercentage)}%
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>★ {product.rating.toFixed(1)}</Text>
                    <Text style={styles.stockText}>Stock: {product.stock}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        marginHorizontal: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: width * 0.35,
        height: width * 0.35,
        backgroundColor: '#F5F5F5',
    },
    infoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    brand: {
        fontSize: 12,
        color: '#8E8E93',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C1C1E',
        lineHeight: 20,
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: '#007AFF',
        marginRight: 8,
    },
    discountBadge: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 13,
        color: '#FF9500',
        fontWeight: '600',
    },
    stockText: {
        fontSize: 12,
        color: '#34C759',
        fontWeight: '500',
    },
});

export default ProductItem;
