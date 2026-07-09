import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  RootTabParamList,
  ShopStackParamList,
  CartStackParamList,
} from '../types';

import {HomeScreen} from '../screens/HomeScreen';
import {ShopScreen} from '../screens/ShopScreen';
import {ProductDetailScreen} from '../screens/ProductDetailScreen';
import {ProductFormScreen} from '../screens/ProductFormScreen';
import {CartScreen} from '../screens/CartScreen';
import {CheckoutScreen} from '../screens/CheckoutScreen';
import {SettingsScreen} from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const ShopStack = createNativeStackNavigator<ShopStackParamList>();
const CartStack = createNativeStackNavigator<CartStackParamList>();

function ShopNavigator() {
  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
      }}>
      <ShopStack.Screen
        name="ShopList"
        component={ShopScreen}
        options={{headerShown: false}}
      />
      <ShopStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{title: 'Product Details'}}
      />
      <ShopStack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={({route}) => ({
          title: route.params?.productId ? 'Edit Product' : 'Add Product',
        })}
      />
    </ShopStack.Navigator>
  );
}

function CartNavigator() {
  return (
    <CartStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
      }}>
      <CartStack.Screen
        name="CartMain"
        component={CartScreen}
        options={{headerShown: false}}
      />
      <CartStack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{title: 'Checkout'}}
      />
    </CartStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: '#2ecc71',
          tabBarInactiveTintColor: '#999',

          tabBarStyle: {
            height: 58,
            paddingTop: 6,
            paddingBottom: 6,
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
          },

          tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: '600',
          },

          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
          }}
        />

        <Tab.Screen
          name="Shop"
          component={ShopNavigator}
          options={{
            tabBarLabel: 'Shop',
          }}
        />

        <Tab.Screen
          name="Cart"
          component={CartNavigator}
          options={{
            tabBarLabel: 'Cart',
          }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}