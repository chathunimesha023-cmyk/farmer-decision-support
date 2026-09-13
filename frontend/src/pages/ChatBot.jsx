import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'ආයුබෝවන්! 🌾 මම Agri ChatBot. ඔබට අද කුමන බෝග වගාවක්, පොහොර, ජල සම්පාදනය හෝ පළිබෝධ පාලනයක් පිළිබඳ ගැටලුවක් ඇත්නම් මෙහි විමසන්න.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMessage = { sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const text = userText.toLowerCase();
    let botResponseText = 'සමාවන්න, මට ඒ ගැන තවම නිශ්චිත තොරතුරු නැත. නමුත් ඔබට පොහොර, ජල සම්පාදනය, මිරිස්, තක්කාලි, වී, අර්තාපල්, පළිබෝධ හෝ සත්ව හානි ගැන අසන්න පුළුවන්. 🧑‍🌾';

    // Conversational & Agricultural Knowledge Base
    if (text.includes('hi') || text.includes('hello') || text.includes('ආයුබෝවන්') || text.includes('ayubowan')) {
      botResponseText = 'ආයුබෝවන්! ඔබේ ගොවිබිමට අවශ්‍ය ඕනෑම උපදෙසක් විමසන්න. මම ඔබට උදව් කිරීමට සූදානම්. 🌾';
    } 
    else if (text.includes('පොහොර') || text.includes('fertilizer') || text.includes('pohora') || text.includes('compost')) {
      botResponseText = '🌱 පොහොර උපදෙස්: කාබනික කොම්පෝස්ට් හෝ ගොම පොහොර යෙදීමෙන් පසෙහි සරුබව වැඩිකරගත හැක. බෝග වර්ධනයට යූරියා (N) ද, මල් පිපීමට ත්‍රිත්ව සුපර් පොස්පේට් (P) ද, ඵලදාවට මියුරියේට් ඔෆ් පොටෑෂ් (K) ද නියමිත මාත්‍රාවෙන් යොදන්න.';
    } 
    else if (text.includes('මිරිස්') || text.includes('miris') || text.includes('chili') || text.includes('pepper')) {
      botResponseText = '🌶️ මිරිස් වගාව: මිරිස් වගාවට හොඳින් හිරු එළිය සහ මනා ජල වහනයක් සහිත ලෝම පසක් අවශ්‍ය වේ. පස බුරුල්ව තබා ගන්න. කොළ කොඩවීම වළක්වා ගැනීමට කහ උගුල් යොදන්න.';
    }
    else if (text.includes('කොළ කොඩ') || text.includes('kola koda') || text.includes('leaf curl')) {
      botResponseText = '🍃 කොළ කොඩවීම: මෙය සුදු මැස්සන් (Whiteflies) හෝ පැළ මැක්කන් (Thrips) නිසා බෝවන වෛරසයකි. කහ පැහැති ඇලෙන උගුල් වගාවේ සවිකර කොහොඹ තෙල් සබන් ද්‍රාවණය සතියකට වරක් ඉසින්න.';
    }
    else if (text.includes('තක්කාලි') || text.includes('thakkali') || text.includes('tomato')) {
      botResponseText = '🍅 තක්කාලි වගාව: හොඳ හිරු එළියක් සහ කාබනික පොහොර අවශ්‍ය වේ. පැළ සිටුවා දින 14 කට පසු ආධාරක (Stakes) ලබා දීමෙන් පලදාව බිම නොගෑවී නිරෝගීව තබාගත හැක.';
    }
    else if (text.includes('තක්කාලි වතුර') || text.includes('thakkali wathura') || text.includes('watering tomato')) {
      botResponseText = '💧 තක්කාලි ජල සම්පාදනය: තක්කාලි පැළවල මුලට පමණක් ජලය සැපයීම වඩාත් සුදුසුයි. කොළ මත ජලය වැටීමෙන් දිලීර රෝග (Blight) ඇති විය හැකි බැවින් බිංදු ජල සම්පාදනය වඩාත් යෝග්‍ය වේ.';
    }
    else if (text.includes('වී') || text.includes('paddy') || text.includes('rice') || text.includes('wee')) {
      botResponseText = '🌾 වී වගාව: ගොයම් ගස මල් පිපෙන හා කරල් පිරෙන අවධියේදී ක්ෂේත්‍රයේ අඟල් 2-3 ක ජල මට්ටමක් පවත්වා ගැනීම ඉහළ අස්වැන්නකට අත්‍යවශ්‍ය වේ.';
    }
    else if (text.includes('වම්බටු') || text.includes('wambatu') || text.includes('brinjal') || text.includes('eggplant')) {
      botResponseText = '🍆 වම්බටු වගාව: කාබනික පොහොර බහුලව යොදන්න. කරටි හා කරල් විදින පණුවන්ගෙන් බේරීමට හානි වූ රිකිලි කපා විනාශ කර ෆෙරමෝන් උගුල් (Pheromone traps) භාවිත කරන්න.';
    }
    else if (text.includes('අර්තාපල්') || text.includes('artapal') || text.includes('potato')) {
      botResponseText = '🥔 අර්තාපල් වගාව: අල බැඳෙන කාලයේදී අල වටා පස් එකතු කිරීම (Earthing up) ඉතා වැදගත් වේ. එමගින් අල හිරු එළියට නිරාවරණය වී කොළ පැහැ වීම වළක්වා ගත හැක.';
    }
    else if (text.includes('කැරට්') || text.includes('carrot')) {
      botResponseText = '🥕 කැරට් වගාව: ගල් කැට රහිත ගැඹුරට බුරුල් කළ වැලි ලෝම පසක් අවශ්‍ය වේ. පස තද වුවහොත් අල ඇද ගැසීමට ඉඩ ඇත.';
    }
    else if (text.includes('බෝංචි') || text.includes('bonchi') || text.includes('beans')) {
      botResponseText = '🌱 බෝංචි වගාව: අධික උෂ්ණත්වය මල් හැලීමට හේතු වේ. පස වියළීමට නොදී මධ්‍යස්ථව ජලය සපයන්න. පොටෑසියම් බහුල පොහොර යෙදීමෙන් කරල් සරු වේ.';
    }
    else if (text.includes('ජලය') || text.includes('wathura') || text.includes('water') || text.includes('irrigation')) {
      botResponseText = '💧 ජල සම්පාදන උපදෙස්: උදෑසන 6.00 - 8.30 හෝ සවස 4.30 න් පසු ජලය සැපයීමෙන් වාෂ්පීභවනය අවම කර ජලය ඉතිරි කරගත හැක.';
    }
    else if (text.includes('පළිබෝධ') || text.includes('pest') || text.includes('insects') || text.includes('panuwo')) {
      botResponseText = '🛡️ පළිබෝධ පාලනය: කෘමීන් ආකර්ෂණය කර ගැනීමට කහ සහ නිල් ඇලෙන උගුල් යොදන්න. කොහොඹ ඇට සාරය (50g/1L) හෝ සබන් මිශ්‍ර දුම්කොළ ද්‍රාවණය ස්වාභාවික කෘමි නාශක ලෙස සාර්ථකයි.';
    }
    else if (text.includes('සතුන්') || text.includes('ඌරන්') || text.includes('වඳුරන්') || text.includes('animals') || text.includes('wild')) {
      botResponseText = '🐾 සත්ව හානි වැළැක්වීම: 1. කටු කම්බි හෝ දැල් වැටවල් සවි කරන්න. 2. සතුන් බිය ගැන්වීමට සුළං බලයෙන් ශබ්ද නගන උපකරණ එල්ලන්න. 3. සතුන්ට අප්‍රසන්න ගන්ධයක් සහිත කොහොඹ හෝ කපුරු ද්‍රාවණ වගා මායිමේ තබන්න. 4. රාත්‍රියට LED ආලෝක පහන් භාවිත කරන්න.';
    }
    else if (text.includes('ස්තුතියි') || text.includes('thank') || text.includes('thanks')) {
      botResponseText = 'ඔබට සතුටුයි! ඔබේ ගොවි කටයුතු සාර්ථක වේවා! තවත් ඕනෑම ගැටලුවක් ඇත්නම් මගෙන් විමසන්න. 🌾💚';
    }

    const botResponse = { sender: 'bot', text: botResponseText };

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  // Styles
  const pageStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#e2f7d5' };
  const containerStyle = { display: 'flex', flex: 1 };
  const contentStyle = { flex: 1, padding: '32px 40px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' };
  const chatContainerStyle = { flex: 1, backgroundColor: '#fff', borderRadius: '18px', border: '1px solid #d1e7dd', display: 'flex', flexDirection: 'column', maxWidth: '850px', height: '520px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' };
  const chatMessagesStyle = { flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' };
  const botBubbleStyle = { alignSelf: 'flex-start', backgroundColor: '#f0fdf4', color: '#14532d', padding: '14px 18px', borderRadius: '16px 16px 16px 4px', maxWidth: '75%', border: '1px solid #bbf7d0', lineHeight: '1.5', fontSize: '15px' };
  const userBubbleStyle = { alignSelf: 'flex-end', backgroundColor: '#3d7a44', color: '#fff', padding: '14px 18px', borderRadius: '16px 16px 4px 16px', maxWidth: '75%', lineHeight: '1.5', fontSize: '15px' };
  const inputAreaStyle = { display: 'flex', padding: '16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', gap: '12px' };
  const inputStyle = { flex: 1, padding: '14px 18px', borderRadius: '12px', border: '1.5px solid #86efac', fontSize: '15px', outline: 'none', backgroundColor: '#fff' };
  const sendBtnStyle = { backgroundColor: '#3d7a44', color: '#fff', border: 'none', padding: '0 28px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.2s' };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={containerStyle}>
        <Sidebar />

        <div style={contentStyle}>
          <h2 style={{ fontSize: '28px', color: '#1c3c1c', margin: '0 0 5px 0' }}>Agri ChatBot 🤖</h2>
          <p style={{ color: '#446644', margin: '0 0 20px 0' }}>Ask any question about crops, diseases, fertilizers, watering, or pest control.</p>
          
          <div style={chatContainerStyle}>
            <div style={chatMessagesStyle}>
              {messages.map((msg, index) => (
                <div key={index} style={msg.sender === 'bot' ? botBubbleStyle : userBubbleStyle}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ ...botBubbleStyle, fontStyle: 'italic', color: '#64748b' }}>
                  AgriBot is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSend} style={inputAreaStyle}>
              <input 
                type="text" 
                placeholder="පොහොර, ජලය, පළිබෝධ හෝ බෝග ගැන අසන්න..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                style={inputStyle} 
              />
              <button type="submit" style={sendBtnStyle} disabled={isTyping}>
                Send ➤
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}