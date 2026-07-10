package com.fooddelivery.config;

import com.fooddelivery.entity.FoodCategory;
import com.fooddelivery.entity.FoodItem;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.repository.FoodCategoryRepository;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    private final FoodCategoryRepository categoryRepository;
    private final FoodItemRepository foodItemRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (restaurantRepository.count() > 0) {
            return;
        }

        log.info("Seeding sample restaurants and food items...");

        Map<String, FoodCategory> categories = seedCategories();
        seedRestaurants(categories);

        log.info("Seed data loaded successfully");
    }

    private Map<String, FoodCategory> seedCategories() {
        List<FoodCategory> categories = List.of(
                category("Pizza", "Wood-fired and classic pizzas"),
                category("Burger", "Juicy burgers and combos"),
                category("Biryani", "Aromatic rice dishes"),
                category("Chinese", "Noodles, fried rice, and starters"),
                category("South Indian", "Dosa, idli, and meals"),
                category("North Indian", "Curries, breads, and thalis"),
                category("Desserts", "Cakes, ice creams, and sweets"),
                category("Beverages", "Shakes, coffee, and soft drinks")
        );
        return categoryRepository.saveAll(categories).stream()
                .collect(java.util.stream.Collectors.toMap(FoodCategory::getName, c -> c));
    }

    private FoodCategory category(String name, String description) {
        return FoodCategory.builder().name(name).description(description).build();
    }

    private void seedRestaurants(Map<String, FoodCategory> categories) {
        Restaurant pizzaHub = saveRestaurant(
                "Pizza Hub",
                "Authentic Italian-style pizzas with fresh toppings and cheesy crusts.",
                "12 Linking Road, Bandra West",
                "Mumbai",
                19.0596,
                72.8295,
                4.5,
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
        );

        Restaurant burgerKing = saveRestaurant(
                "Burger King Street",
                "Flame-grilled burgers, crispy fries, and loaded meal combos.",
                "45 Connaught Place",
                "Delhi",
                28.6315,
                77.2167,
                4.2,
                "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop"
        );

        Restaurant biryaniHouse = saveRestaurant(
                "Biryani House",
                "Hyderabadi dum biryani and kebabs slow-cooked to perfection.",
                "88 Koramangala 5th Block",
                "Bangalore",
                12.9352,
                77.6245,
                4.7,
                "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=600&h=400&fit=crop"
        );

        Restaurant chineseWok = saveRestaurant(
                "Dragon Wok",
                "Spicy Chinese favorites — noodles, manchurian, and fried rice.",
                "22 HSR Layout Sector 2",
                "Bangalore",
                12.9116,
                77.6388,
                4.3,
                "https://images.unsplash.com/photo-1525755662778-989d0520ec57?w=600&h=400&fit=crop"
        );

        Restaurant dosaCorner = saveRestaurant(
                "Dosa Corner",
                "Crispy dosas, fluffy idlis, and filter coffee served all day.",
                "5 Besant Nagar Main Road",
                "Chennai",
                13.0067,
                80.2666,
                4.6,
                "https://images.unsplash.com/photo-1630384089387-1a4a8b2ef2a2?w=600&h=400&fit=crop"
        );

        Restaurant punjabiDhaba = saveRestaurant(
                "Punjabi Dhaba",
                "Rich North Indian curries, tandoori rotis, and hearty thalis.",
                "18 FC Road",
                "Pune",
                18.5204,
                73.8567,
                4.4,
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop"
        );

        seedPizzaHub(pizzaHub, categories);
        seedBurgerKing(burgerKing, categories);
        seedBiryaniHouse(biryaniHouse, categories);
        seedChineseWok(chineseWok, categories);
        seedDosaCorner(dosaCorner, categories);
        seedPunjabiDhaba(punjabiDhaba, categories);
    }

    private Restaurant saveRestaurant(String name, String description, String address,
                                        String city, double lat, double lng, double rating, String imageUrl) {
        return restaurantRepository.save(Restaurant.builder()
                .name(name)
                .description(description)
                .address(address)
                .city(city)
                .latitude(lat)
                .longitude(lng)
                .rating(rating)
                .imageUrl(imageUrl)
                .isActive(true)
                .build());
    }

    private void seedPizzaHub(Restaurant r, Map<String, FoodCategory> c) {
        saveFood("Margherita Pizza", "Classic tomato, mozzarella, and basil", 299, true, r, c.get("Pizza"),
                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop");
        saveFood("Farmhouse Pizza", "Loaded with capsicum, corn, and olives", 399, true, r, c.get("Pizza"),
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop");
        saveFood("Chicken BBQ Pizza", "Smoky BBQ chicken with onions", 449, false, r, c.get("Pizza"),
                "https://images.unsplash.com/photo-1513104890137-7c749659a591?w=400&h=300&fit=crop");
        saveFood("Garlic Bread", "Buttery garlic bread with herbs", 149, true, r, c.get("Pizza"),
                "https://images.unsplash.com/photo-1619535620169-abe5f0596b20?w=400&h=300&fit=crop");
        saveFood("Cold Coffee", "Chilled coffee with ice cream", 129, true, r, c.get("Beverages"),
                "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop");
    }

    private void seedBurgerKing(Restaurant r, Map<String, FoodCategory> c) {
        saveFood("Classic Veg Burger", "Crispy patty with fresh veggies", 149, true, r, c.get("Burger"),
                "https://images.unsplash.com/photo-1568901347635-c5570a71e692?w=400&h=300&fit=crop");
        saveFood("Chicken Crunch Burger", "Juicy chicken patty with cheese", 219, false, r, c.get("Burger"),
                "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop");
        saveFood("Double Cheese Burger", "Two patties, double cheese", 279, false, r, c.get("Burger"),
                "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop");
        saveFood("Peri Peri Fries", "Spicy crispy fries", 99, true, r, c.get("Burger"),
                "https://images.unsplash.com/photo-1573080496219-b998ba50c247?w=400&h=300&fit=crop");
        saveFood("Chocolate Shake", "Thick chocolate milkshake", 149, true, r, c.get("Beverages"),
                "https://images.unsplash.com/photo-1572490122747-3964b75cc699?w=400&h=300&fit=crop");
    }

    private void seedBiryaniHouse(Restaurant r, Map<String, FoodCategory> c) {
        saveFood("Chicken Dum Biryani", "Slow-cooked Hyderabadi biryani", 349, false, r, c.get("Biryani"),
                "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop");
        saveFood("Mutton Biryani", "Tender mutton with fragrant rice", 449, false, r, c.get("Biryani"),
                "https://images.unsplash.com/photo-1631452189869-e81b17445272?w=400&h=300&fit=crop");
        saveFood("Veg Biryani", "Mixed vegetables with basmati rice", 249, true, r, c.get("Biryani"),
                "https://images.unsplash.com/photo-1642821373181-696a549bf3d3?w=400&h=300&fit=crop");
        saveFood("Raita", "Cool yogurt side with cucumber", 49, true, r, c.get("North Indian"),
                "https://images.unsplash.com/photo-1626074353765-517a5e3971ef?w=400&h=300&fit=crop");
        saveFood("Gulab Jamun", "Soft milk dumplings in syrup", 79, true, r, c.get("Desserts"),
                "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop");
    }

    private void seedChineseWok(Restaurant r, Map<String, FoodCategory> c) {
        saveFood("Veg Hakka Noodles", "Stir-fried noodles with vegetables", 199, true, r, c.get("Chinese"),
                "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop");
        saveFood("Chicken Fried Rice", "Wok-tossed rice with chicken", 249, false, r, c.get("Chinese"),
                "https://images.unsplash.com/photo-1603133872877-684f208fb89b?w=400&h=300&fit=crop");
        saveFood("Veg Manchurian", "Crispy balls in spicy gravy", 219, true, r, c.get("Chinese"),
                "https://images.unsplash.com/photo-1525755662778-989d0520ec57?w=400&h=300&fit=crop");
        saveFood("Chilli Chicken", "Indo-Chinese spicy chicken starter", 279, false, r, c.get("Chinese"),
                "https://images.unsplash.com/photo-1606491956689-2ea866884717?w=400&h=300&fit=crop");
        saveFood("Spring Rolls", "Crispy vegetable rolls", 149, true, r, c.get("Chinese"),
                "https://images.unsplash.com/photo-1529042410759-befb1204b916?w=400&h=300&fit=crop");
    }

    private void seedDosaCorner(Restaurant r, Map<String, FoodCategory> c) {
        saveFood("Masala Dosa", "Crispy dosa with potato filling", 120, true, r, c.get("South Indian"),
                "https://images.unsplash.com/photo-1630384089387-1a4a8b2ef2a2?w=400&h=300&fit=crop");
        saveFood("Plain Idli", "Steamed rice cakes with chutney", 80, true, r, c.get("South Indian"),
                "https://images.unsplash.com/photo-1589302168068-964664a07101?w=400&h=300&fit=crop");
        saveFood("Medu Vada", "Crispy lentil donuts with sambar", 90, true, r, c.get("South Indian"),
                "https://images.unsplash.com/photo-1601050690117-94f5a6a6d2f0?w=400&h=300&fit=crop");
        saveFood("Filter Coffee", "Traditional South Indian coffee", 50, true, r, c.get("Beverages"),
                "https://images.unsplash.com/photo-1514432324607-09a9a4e4a4e0?w=400&h=300&fit=crop");
        saveFood("Mini Tiffin", "Idli, vada, dosa combo platter", 199, true, r, c.get("South Indian"),
                "https://images.unsplash.com/photo-1668236541030-9c139a4a1a50?w=400&h=300&fit=crop");
    }

    private void seedPunjabiDhaba(Restaurant r, Map<String, FoodCategory> c) {
        saveFood("Paneer Butter Masala", "Creamy tomato curry with paneer", 279, true, r, c.get("North Indian"),
                "https://images.unsplash.com/photo-1635689313137-4a1a5e7a5f6e?w=400&h=300&fit=crop");
        saveFood("Butter Chicken", "Rich tomato-butter chicken curry", 329, false, r, c.get("North Indian"),
                "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop");
        saveFood("Dal Makhani", "Slow-cooked black lentils", 229, true, r, c.get("North Indian"),
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop");
        saveFood("Garlic Naan", "Soft tandoori bread with garlic", 49, true, r, c.get("North Indian"),
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop");
        saveFood("Lassi", "Sweet yogurt drink", 79, true, r, c.get("Beverages"),
                "https://images.unsplash.com/photo-1626074353765-517a5e3971ef?w=400&h=300&fit=crop");
    }

    private void saveFood(String name, String description, int price, boolean isVeg,
                          Restaurant restaurant, FoodCategory category, String imageUrl) {
        foodItemRepository.save(FoodItem.builder()
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .isVeg(isVeg)
                .isAvailable(true)
                .restaurant(restaurant)
                .category(category)
                .imageUrl(imageUrl)
                .build());
    }
}
