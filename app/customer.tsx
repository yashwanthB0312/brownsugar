// app/customer.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type CartItem = Product & { quantity: number };

export default function Customer() {
  const [activePage, setActivePage] = useState<"products" | "cart" | "orders">(
    "products"
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<CartItem[][]>([]);

  const products: Product[] = [
    {
      id: 1,
      name: "Classic Brown Sugar Milk Tea",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1587731619894-8f9d2dce69f6",
    },
    {
      id: 2,
      name: "Brown Sugar Boba Latte",
      price: 150,
      image:
        "https://images.unsplash.com/photo-1587731507580-d9f3f2e6b0b9",
    },
    {
      id: 3,
      name: "Brown Sugar Ice Cream",
      price: 100,
      image:
        "https://images.unsplash.com/photo-1606813902917-5b6d65f4e5d3",
    },
  ];

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    setOrders((prev) => [...prev, cart]);
    setCart([]);
    setActivePage("orders");
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.btnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.image }} style={styles.image} />
    </View>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, -1)}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image source={{ uri: item.image }} style={styles.image} />
    </View>
  );

  const renderOrder = ({ item, index }: { item: CartItem[]; index: number }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Order #{index + 1}</Text>
      {item.map((p) => (
        <Text key={p.id}>
          {p.name} × {p.quantity} = ₹{p.price * p.quantity}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Brown Sugar Shop</Text>
      </View>

      {/* Page Content */}
      {activePage === "products" && (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 10 }}
        />
      )}

      {activePage === "cart" && (
        <View style={{ flex: 1 }}>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 10 }}
          />
          {cart.length > 0 && (
            <TouchableOpacity style={styles.placeBtn} onPress={placeOrder}>
              <Text style={styles.placeText}>Place Order</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {activePage === "orders" && (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ padding: 10 }}
        />
      )}

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActivePage("products")}>
          <Ionicons name="pricetags" size={24} color="white" />
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActivePage("cart")}>
          <Ionicons name="cart" size={24} color="white" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.badgeText}>
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </Text>
            </View>
          )}
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActivePage("orders")}>
          <Ionicons name="list" size={24} color="white" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#8B4513",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  badgeText: { color: "white", fontSize: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  image: { width: 80, height: 80, borderRadius: 8, marginLeft: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  price: { color: "#8B4513", marginVertical: 5 },
  btn: {
    backgroundColor: "#8B4513",
    padding: 5,
    borderRadius: 5,
  },
  btnText: { color: "white" },
  qtyBtn: {
    backgroundColor: "#ddd",
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  placeBtn: {
    backgroundColor: "#8B4513",
    padding: 15,
    alignItems: "center",
  },
  placeText: { color: "white", fontSize: 16, fontWeight: "bold" },
  orderCard: {
    backgroundColor: "#f1e4d3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  orderTitle: { fontWeight: "bold", marginBottom: 5 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#8B4513",
    paddingVertical: 8,
  },
  navText: { color: "white", fontSize: 12, textAlign: "center" },
});
