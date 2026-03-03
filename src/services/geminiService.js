import { GoogleGenerativeAI } from '@google/generative-ai';
import { menuItems } from '../data/menuItems';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Build the system prompt from menu data
function buildSystemPrompt() {
  const menuText = menuItems
    .map(
      (item) =>
        `- ${item.name} (${item.price} AZN): ${item.description}
   Tərkib: ${item.ingredients.join(', ')}
   Allergenlər: ${item.allergens.join(', ')}
   Kalori: ${item.calories} kal`
    )
    .join('\n');

  return `Sən "Zest & Flame" restoranının süni intellekt yardımçısısan. Aşağıda restoran menyusu verilmişdir.

MENYU:
${menuText}

QAYDALAR:
- Yalnız menyu ilə bağlı sualları cavablandır.
- Müştərilərə personallaşdırılmış tövsiyələr ver.
- Allergeni olan müştərilərə xüsusi diqqət et və allergen məlumatını aydın şəkildə çatdır.
- Cavabları qısa, mehriban və peşəkar saxla.
- Müştəri hansı dildə yazırsa (Azərbaycan, Rus, İngilis, Türk), həmin dildə cavab ver.
- Qiymətləri AZN ilə göstər (menyudakı USD qiymətlərini AZN kimi qeyd et).
- Əgər sual menyu ilə əlaqəli deyilsə, mehriban şəkildə yalnız yemək mövzusunda kömək edə biləcəyini bildir.`;
}

let genAI = null;

export function initGemini() {
  if (!API_KEY) {
    console.warn('VITE_GEMINI_API_KEY is not set. AI chat will use mock mode.');
    return false;
  }
  genAI = new GoogleGenerativeAI(API_KEY);
  return true;
}

export async function sendMessage(userMessage, history = []) {
  // Mock mode when no API key
  if (!API_KEY) {
    return getMockResponse(userMessage);
  }

  if (!genAI) initGemini();

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: buildSystemPrompt(),
  });

  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

// Mock responses for demo without API key
function getMockResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('salam') || lower.includes('hello') || lower.includes('hi')) {
    return 'Salam! Mən Zest & Flame restoranının AI yardımçısıyam. Menyu, allergenlər, tövsiyələr haqqında kömək edə bilərəm. Nə soruşmaq istəyirsiniz? 😊';
  }
  if (lower.includes('burger') || lower.includes('hambur')) {
    return 'The Flame Burger bizim ən populyar burgerimizdir! 🍔\n\nQoşa Wagyu kotlet, köhnəlmiş çedar, karamelizə soğan və gizli sous ilə hazırlanır. Qiyməti: 16.00 AZN\n\nAllergenlər: gluten, süd məhsulları, yumurta\nKalori: 890 kal';
  }
  if (lower.includes('allergen') || lower.includes('allergiya') || lower.includes('allerji')) {
    return 'Allergen məlumatı üçün hansı yeməyi soruşmaq istəyirsiniz? Bütün yeməklərimizin tərkib və allergen məlumatı mövcuddur. Sadəcə yemək adını yazın.';
  }
  if (lower.includes('tövsiy') || lower.includes('recommend') || lower.includes('nə') || lower.includes('what')) {
    return 'Sizə xüsusi tövsiyəm: 🌟\n\n1. Glutensiz: Glazed Atlantic Salmon (24.50 AZN) - ən sağlam seçim\n2. Ailəvi: Smoked Pork Ribs (22.00 AZN) - toy süfrasına layiq\n3. Yüngül: Garden Zest Salad (12.50 AZN) - tam sağlam\n\nHansı haqqında ətraflı məlumat istəyirsiniz?';
  }
  return 'Bu sual üçün AI açarının konfiqurasiyası lazımdır. Demo modu aktivdir — .env faylında VITE_GEMINI_API_KEY əlavə edin. Burgerlər, allergenlər, tövsiyələr haqqında demo cavab almaq üçün isə bu açar sözləri yazın!';
}
