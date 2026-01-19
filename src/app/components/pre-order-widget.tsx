import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

type ConversationStep = "welcome" | "name" | "phone" | "occasion" | "message" | "confirm" | "complete";

export function PreOrderWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<ConversationStep>("welcome");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    occasion: "",
    message: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial bot message
      setTimeout(() => {
        addBotMessage(
          "Hello! 👋 Welcome to our Seasonal Pre-Order service. I'm here to help you reserve your perfect outfit for weddings and special events! ✨"
        );
        setTimeout(() => {
          addBotMessage("What's your name?");
          setStep("name");
        }, 1000);
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    addUserMessage(userInput);
    setInput("");

    // Process based on current step
    setTimeout(() => {
      processStep(userInput);
    }, 500);
  };

  const processStep = (userInput: string) => {
    switch (step) {
      case "name":
        setFormData((prev) => ({ ...prev, name: userInput }));
        addBotMessage(`Nice to meet you, ${userInput}! 🌟`);
        setTimeout(() => {
          addBotMessage("Could you please share your phone number? We'll use this to contact you with customized options.");
          setStep("phone");
        }, 1000);
        break;

      case "phone":
        setFormData((prev) => ({ ...prev, phone: userInput }));
        addBotMessage("Perfect! Got your number. 📱");
        setTimeout(() => {
          addBotMessage("What's the special occasion? (e.g., Wedding, Reception, Sangeet, Anniversary)");
          setStep("occasion");
        }, 1000);
        break;

      case "occasion":
        setFormData((prev) => ({ ...prev, occasion: userInput }));
        addBotMessage(`${userInput} - How wonderful! 💐`);
        setTimeout(() => {
          addBotMessage("Any specific requirements? Tell me about preferred colors, styles, date, or anything else you'd like us to know. (Type 'skip' if none)");
          setStep("message");
        }, 1000);
        break;

      case "message":
        const message = userInput.toLowerCase() === "skip" ? "" : userInput;
        setFormData((prev) => ({ ...prev, message }));
        
        setTimeout(() => {
          addBotMessage("Great! Let me confirm your pre-order request:");
          setTimeout(() => {
            addBotMessage(
              `📋 **Summary**\n\n` +
              `👤 Name: ${formData.name}\n` +
              `📱 Phone: ${formData.phone}\n` +
              `🎉 Occasion: ${formData.occasion}\n` +
              `${message ? `💬 Details: ${message}\n` : ""}\n` +
              `Type 'confirm' to submit or 'cancel' to start over.`
            );
            setStep("confirm");
          }, 1000);
        }, 500);
        break;

      case "confirm":
        if (userInput.toLowerCase() === "confirm") {
          submitPreOrder();
        } else if (userInput.toLowerCase() === "cancel") {
          resetChat();
        } else {
          addBotMessage("Please type 'confirm' to submit your request or 'cancel' to start over.");
        }
        break;
    }
  };

  const submitPreOrder = async () => {
    setLoading(true);
    addBotMessage("Submitting your pre-order request... ⏳");

    try {
      // Save to database
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/pre-order-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...formData,
            type: "seasonal",
            timestamp: new Date().toISOString(),
          }),
        }
      );

      // Get response text first
      const responseText = await response.text();
      
      // Check if response is OK
      if (!response.ok) {
        console.error("Pre-order submit error - Response not OK:", responseText);
        throw new Error(`Failed to submit: ${responseText}`);
      }

      // Parse JSON if response was successful
      const data = JSON.parse(responseText);
      
      if (data.success) {
        addBotMessage(
          "✅ Success! Opening WhatsApp to send your request..."
        );
        
        // Create WhatsApp message
        const whatsappMessage = `🎊 *New Pre-Order Request*\n\n` +
          `👤 Name: ${formData.name}\n` +
          `📱 Phone: ${formData.phone}\n` +
          `🎉 Occasion: ${formData.occasion}\n` +
          `${formData.message ? `💬 Details: ${formData.message}\n` : ''}` +
          `🕒 Time: ${new Date().toLocaleString()}`;
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/918147008048?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        // Close the widget after a delay
        setTimeout(() => {
          setIsOpen(false);
          resetChat();
        }, 3000);
      } else {
        throw new Error(data.message || "Failed to submit pre-order");
      }
    } catch (error) {
      console.error("Pre-order submit error:", error);
      addBotMessage(
        "❌ Sorry, there was an error submitting your request. Please try again or contact us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setFormData({ name: "", phone: "", occasion: "", message: "" });
    setStep("welcome");
    addBotMessage("Let's start over! What's your name?");
    setStep("name");
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset after animation
    setTimeout(() => {
      setMessages([]);
      setFormData({ name: "", phone: "", occasion: "", message: "" });
      setStep("welcome");
    }, 300);
  };

  return (
    <>
      {/* Floating Round Chatbot Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="h-14 w-14 md:h-16 md:w-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
        style={{
          position: 'fixed',
          left: '1.5rem',
          bottom: '1.5rem',
          zIndex: 40,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -8, 0],
        }}
        transition={{ 
          opacity: { delay: 0.5, duration: 0.3 },
          scale: { delay: 0.5, type: "spring", stiffness: 260, damping: 20 },
          y: {
            delay: 1,
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Static Icon - no continuous animation */}
        <Sparkles className="h-6 w-6 md:h-7 md:w-7" />
        
        {/* Tooltip on hover */}
        <div className="absolute left-full ml-3 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Pre-Order for Events
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
        </div>
      </motion.button>

      {/* Chat Dialog */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
              style={{ height: "600px", maxHeight: "90vh" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ fontFamily: "'Alumni Sans', sans-serif" }}>
                      Pre-Order Assistant
                    </h3>
                    <p className="text-xs opacity-90">Online • Ready to help</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          message.sender === "user" ? "text-white/70" : "text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t rounded-b-2xl">
                {step !== "complete" ? (
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
                      placeholder="Type your message..."
                      disabled={loading || step === "welcome"}
                      className="flex-1 transition-all duration-200 focus:scale-[1.01]"
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <Button
                        onClick={handleSend}
                        disabled={!input.trim() || loading || step === "welcome"}
                        size="icon"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <Button
                      onClick={handleClose}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Close Chat
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}