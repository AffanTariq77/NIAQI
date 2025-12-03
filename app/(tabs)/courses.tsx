import React, { useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview";
import { KAJABI_CONFIG } from "@/lib/config";

const CoursesScreen = () => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    // Handle navigation if needed
    const { url } = navState;

    // Open external links (non-Kajabi domains) in system browser
    if (url && !url.includes("mykajabi.com")) {
      // Optionally prevent navigation and open in external browser
      // Linking.openURL(url);
      // return false;
    }
  };

  const injectedJavaScript = `
    // Remove scrollbars
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Make external links open in new tab
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('mykajabi.com') && !href.startsWith('/') && !href.startsWith('#')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    // Observe for dynamically added links
    const observer = new MutationObserver(() => {
      const newLinks = document.querySelectorAll('a:not([data-processed])');
      newLinks.forEach(link => {
        link.setAttribute('data-processed', 'true');
        const href = link.getAttribute('href');
        if (href && !href.includes('mykajabi.com') && !href.startsWith('/') && !href.startsWith('#')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    true;
  `;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: KAJABI_CONFIG.STOREFRONT_URL }}
          style={styles.webView}
          onLoad={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
          onNavigationStateChange={handleNavigationStateChange}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={true}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          // Allow mixed content for compatibility
          mixedContentMode="compatibility"
          // Enable automatic height adjustment
          {...(Platform.OS === "ios" && {
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
          })}
          // Enable cookies and storage
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9DAFFB" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  webViewContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  webView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default CoursesScreen;
