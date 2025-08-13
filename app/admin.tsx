import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Product = {
  id: number;
  imageUrl: string;
  name: string;
  quantity: number;
  price: number;
  expiryDate: string; // yyyy-mm-dd
};

// Modal component to edit a product
function EditProductModal({
  visible,
  product,
  onSave,
  onCancel,
}: {
  visible: boolean;
  product: Product | null;
  onSave: (form: {
    imageUrl: string;
    name: string;
    quantity: string;
    price: string;
    expiryDate: string;
  }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    imageUrl: "",
    name: "",
    quantity: "",
    price: "",
    expiryDate: "",
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setForm({
        imageUrl: product.imageUrl,
        name: product.name,
        quantity: product.quantity.toString(),
        price: product.price.toString(),
        expiryDate: product.expiryDate,
      });
    } else {
      setForm({
        imageUrl: "",
        name: "",
        quantity: "",
        price: "",
        expiryDate: "",
      });
    }
  }, [product]);

  if (!visible) return null;

  const inputStyle = {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ backgroundColor: "white", borderRadius: 8, padding: 20 }}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <TextInput
                placeholder="Image URL"
                style={inputStyle}
                value={form.imageUrl}
                onChangeText={(text) => setForm((f) => ({ ...f, imageUrl: text }))}
                autoCapitalize="none"
                keyboardType="url"
              />
              <TextInput
                placeholder="Product Name"
                style={inputStyle}
                value={form.name}
                onChangeText={(text) => setForm((f) => ({ ...f, name: text }))}
              />
              <TextInput
                placeholder="Quantity"
                style={inputStyle}
                keyboardType="numeric"
                value={form.quantity}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text)) setForm((f) => ({ ...f, quantity: text }));
                }}
              />
              <TextInput
                placeholder="Price"
                style={inputStyle}
                keyboardType="numeric"
                value={form.price}
                onChangeText={(text) => {
                  if (/^\d*\.?\d*$/.test(text)) setForm((f) => ({ ...f, price: text }));
                }}
              />
              <TextInput
                placeholder="Expiry Date (YYYY-MM-DD)"
                style={inputStyle}
                value={form.expiryDate}
                onChangeText={(text) => setForm((f) => ({ ...f, expiryDate: text }))}
                autoCapitalize="none"
              />

              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={{
                    padding: 12,
                    backgroundColor: "#ccc",
                    borderRadius: 6,
                    marginRight: 10,
                  }}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSave(form)}
                  style={{ padding: 12, backgroundColor: "#007AFF", borderRadius: 6 }}
                >
                  <Text style={{ color: "white" }}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default function Admin() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"Orders" | "Products">("Products");
  const [products, setProducts] = useState<Product[]>([]);

  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const screenHeight = Dimensions.get("window").height;

  const toggleSidebar = () => setSidebarVisible((v) => !v);

  const validateProductFields = (
    imageUrl: string,
    name: string,
    quantity: string,
    price: string,
    expiryDate: string
  ): string | null => {
    if (!imageUrl.trim()) return "Please enter an image URL";
    if (!name.trim()) return "Please enter product name";
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0)
      return "Please enter valid quantity";
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0)
      return "Please enter valid price";
    if (!expiryDate.trim()) return "Please enter expiry date (YYYY-MM-DD)";
    return null;
  };

  const addProduct = () => {
    const error = validateProductFields(imageUrl, name, quantity, price, expiryDate);
    if (error) {
      Alert.alert(error);
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      imageUrl: imageUrl.trim(),
      name: name.trim(),
      quantity: Number(quantity),
      price: Number(price),
      expiryDate: expiryDate.trim(),
    };

    setProducts((p) => [...p, newProduct]);
    clearForm();
    Alert.alert("Product added!");
  };

  const clearForm = () => {
    setImageUrl("");
    setName("");
    setQuantity("");
    setPrice("");
    setExpiryDate("");
  };

  const deleteProduct = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setProducts((p) => p.filter((prod) => prod.id !== id));
          },
        },
      ]
    );
  };

  const openEditModal = (product: Product) => {
    setProductToEdit(product);
    setEditModalVisible(true);
  };

  const saveEditProduct = (form: {
    imageUrl: string;
    name: string;
    quantity: string;
    price: string;
    expiryDate: string;
  }) => {
    if (!productToEdit) return;

    const error = validateProductFields(
      form.imageUrl,
      form.name,
      form.quantity,
      form.price,
      form.expiryDate
    );
    if (error) {
      Alert.alert(error);
      return;
    }

    setProducts((products) =>
      products.map((p) =>
        p.id === productToEdit.id
          ? {
              ...p,
              imageUrl: form.imageUrl,
              name: form.name,
              quantity: Number(form.quantity),
              price: Number(form.price),
              expiryDate: form.expiryDate,
            }
          : p
      )
    );
    setEditModalVisible(false);
    setProductToEdit(null);
    Alert.alert("Product updated!");
  };

  const cancelEdit = () => {
    setEditModalVisible(false);
    setProductToEdit(null);
  };

  // Styles for inputs and buttons
  const inputStyle = {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  };

  const ProductForm = () => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>
        Manage Products
      </Text>

      <TextInput
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
        style={inputStyle}
        autoCapitalize="none"
        keyboardType="url"
      />

      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={inputStyle}
      />

      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={(text) => {
          if (/^\d*$/.test(text)) setQuantity(text);
        }}
        style={inputStyle}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={(text) => {
          if (/^\d*\.?\d*$/.test(text)) setPrice(text);
        }}
        style={inputStyle}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Expiry Date (YYYY-MM-DD)"
        value={expiryDate}
        onChangeText={setExpiryDate}
        style={inputStyle}
        autoCapitalize="none"
      />

      <TouchableOpacity
        onPress={addProduct}
        style={{
          backgroundColor: "#16a34a",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
          Add Product
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6", position: "relative" }}>
      {/* Hamburger menu button */}
      <TouchableOpacity
        onPress={toggleSidebar}
        style={{
          position: "absolute",
          top: 48,
          left: 16,
          zIndex: 50,
          backgroundColor: "white",
          padding: 12,
          borderRadius: 9999,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        }}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

      {/* Sidebar + Overlay */}
      {sidebarVisible && (
        <>
          {/* Overlay */}
          <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: screenHeight,
                backgroundColor: "rgba(0,0,0,0.2)",
                zIndex: 40,
              }}
            />
          </TouchableWithoutFeedback>

          {/* Sidebar */}
          <View
            style={{
              position: "absolute",
              top: 100,
              left: 10,
              width: 160,
              backgroundColor: "white",
              borderRadius: 8,
              paddingVertical: 20,
              paddingHorizontal: 15,
              zIndex: 50,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            {[
              { label: "Orders", icon: "reader-outline" },
              { label: "Products", icon: "pricetags-outline" },
              { label: "Logout", icon: "log-out-outline" },
            ].map(({ label, icon }) => (
              <TouchableOpacity
                key={label}
                onPress={() => {
                  if (label === "Logout") {
                    Alert.alert("Logged out");
                    router.push("/");
                    setSidebarVisible(false);
                  } else {
                    setActiveMenu(label as "Orders" | "Products");
                    setSidebarVisible(false);
                  }
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  borderRadius: 6,
                  backgroundColor: activeMenu === label ? "#3b82f6" : "transparent",
                }}
              >
                <Ionicons
                  name={icon as any}
                  size={20}
                  color={activeMenu === label ? "white" : "black"}
                  style={{ marginRight: 12 }}
                />
                <Text style={{ color: activeMenu === label ? "white" : "black" }}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Main content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        style={{ flex: 1, paddingHorizontal: 24, paddingTop: 100 }}
      >
        {activeMenu === "Products" && (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={ProductForm}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Left: Product Info */}
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={{ fontWeight: "700", fontSize: 18, marginBottom: 4 }}>
                    {item.name}
                  </Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <Text>Price: ${item.price.toFixed(2)}</Text>
                  <Text>Expiry Date: {item.expiryDate}</Text>

                  {/* Buttons */}
                  <View style={{ flexDirection: "row", marginTop: 12 }}>
                    <TouchableOpacity
                      onPress={() => openEditModal(item)}
                      style={{
                        backgroundColor: "#fbbf24",
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "600" }}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteProduct(item.id)}
                      style={{
                        backgroundColor: "#dc2626",
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "600" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Right: Product Image */}
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    backgroundColor: "#e5e7eb",
                  }}
                  resizeMode="cover"
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 40, color: "#6b7280" }}>
                No products added yet.
              </Text>
            }
          />
        )}

        {activeMenu === "Orders" && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: "#4b5563" }}>
              Orders management coming soon...
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Edit Modal */}
      <EditProductModal
        visible={editModalVisible}
        product={productToEdit}
        onSave={saveEditProduct}
        onCancel={cancelEdit}
      />
    </View>
  );
}
