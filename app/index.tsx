import IconArrow from "@/app/assets/icons/arrow-white-right.svg";
import VideoCarousel1 from "@/app/assets/media/carousel1.mp4";
import VideoCarousel2 from "@/app/assets/media/carousel2.mp4";
import VideoCarousel3 from "@/app/assets/media/carousel3.mp4";
import VideoCarousel4 from "@/app/assets/media/carousel4.mp4";
import VideoCarousel5 from "@/app/assets/media/carousel5.mp4";
import VideoCarousel6 from "@/app/assets/media/carousel6.mp4";
import VideoCarousel7 from "@/app/assets/media/carousel7.mp4";
import VideoCarousel8 from "@/app/assets/media/carousel8.mp4";
import VideoCarousel9 from "@/app/assets/media/carousel9.mp4";
import { ResizeMode, Video } from "expo-av";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "./context/theme";
import useBreakpoints from "./hooks/breakpoints";
import { Text } from "./shared/components/reusable";
import vars from "./styles/vars";

import { useRef } from "react";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";

export type HomeCarouselItemType = {
  videoUrl: string;
  posterUrl: string;
  title: string;
};

export default function Index() {
  const carouselRef = useRef<ICarouselInstance>(null);
  const { theme } = useTheme();
  const breakpoints = useBreakpoints();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    carousel: {
      width: 768,
      height: 576,
      padding: 40,
      justifyContent: "space-between",
      position: "relative",
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: vars.purple2 + vars.opacity20,
      borderRadius: vars.borderMd,
    },
    arrows: {
      width: "auto",
      flexDirection: "row",
      gap: 16,
      position: "relative",
      zIndex: 50,
    },
    arrow: {
      width: 64,
      height: 64,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: vars.light1 + vars.opacity40,
      cursor: "pointer",
    },
    carouselVideoContainer: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 10,
      top: 0,
      left: 0,
      borderRadius: vars.borderMd,
    },
    carouselVideoContent: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 11,
      top: 0,
      left: 0,
      borderRadius: vars.borderMd,
    },
    carouselVideoElement: {
      position: "absolute",
      left: 0,
      right: 0,
      width: "100%",
      height: "100%",
    },
    carouselVideoText: {
      fontSize: 32,
      fontWeight: 600,
      color: vars.white,
      position: "absolute",
      bottom: 40,
      left: 40,
    },
    login: {
      backgroundColor: "blue",
      width: 540,
    },
  });

  type CarouselItemsType = {
    videoUrl: any;
    title: string;
  }[];

  const carouselItems: CarouselItemsType = [
    {
      videoUrl: VideoCarousel1,
      title: "Fully integrated AI chat, speech, imagery, and animation.",
    },
    {
      videoUrl: VideoCarousel2,
      title: "No online predators, safe, secure, private chat",
    },
    {
      videoUrl: VideoCarousel3,
      title:
        "We are ever evolving our technology to improve the AI friend user experience",
    },
    {
      videoUrl: VideoCarousel4,
      title: "Bring your AI friend to life with advanced animation",
    },
    {
      videoUrl: VideoCarousel5,
      title: "No Prompting knowledge required",
    },
    {
      videoUrl: VideoCarousel6,
      title:
        "Use our chat model, or bring your own - either way it uses BFFL.AI technology",
    },
    {
      videoUrl: VideoCarousel7,
      title: "A marketplace to grow your best friend",
    },
    {
      videoUrl: VideoCarousel8,
      title:
        "We will never sell your data or use your chats outside of your account",
    },
    {
      videoUrl: VideoCarousel9,
      title: "Explore your friend's unique universe and backstory",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        <View style={styles.arrows}>
          <Pressable
            style={styles.arrow}
            onPress={() => carouselRef.current?.prev()}
          >
            <IconArrow style={{ transform: [{ rotate: "180deg" }] }} />
          </Pressable>
          <Pressable
            style={styles.arrow}
            onPress={() => carouselRef.current?.next()}
          >
            <IconArrow />
          </Pressable>
        </View>
        <Carousel
          ref={carouselRef}
          loop
          width={768}
          height={576}
          autoPlay={true}
          data={carouselItems}
          autoPlayInterval={9995000}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <View style={styles.carouselVideoContent}>
              <Video
                style={styles.carouselVideoElement}
                videoStyle={styles.carouselVideoElement}
                source={item.videoUrl}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                isMuted
              />
              <Text style={styles.carouselVideoText}>{item.title}</Text>
            </View>
          )}
          style={styles.carouselVideoContainer}
          containerStyle={styles.carouselVideoContainer}
        />
      </View>
      <View style={styles.login}></View>
    </View>
  );
}
