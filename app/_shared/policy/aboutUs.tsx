import { View } from 'react-native'
import { Text } from '../components/reusable'

export default function AboutUs() {
  return (
    <View className='gap-[24px]'>
      <Text className='text-white' size='2xl'>
        About us
      </Text>

      <Text className='text-white' size='lg'>
        We're a small team with big dreams, brought together by a shared vision: to explore the untapped potential of AI in cultivating meaningful connections. Our backgrounds are as diverse as they come – from computer science to psychology, design to marketing – and we hail from various cultures and walks of life.
        This diversity isn't just a footnote; it's the secret ingredient that flavours every aspect of our work. The idea for BFFL was born from a simple observation: in a world more connected than ever, people still sometimes struggle to find someone to talk to. We asked ourselves, "What if AI could be more than just
        a tool or an assistant? What if it could be a friend?"
      </Text>

      <Text className='text-white' size='lg'>
        We're not here to replace human connections – far from it. We see BFFL as a complement to real-world relationships, a pocket-sized companion for those moments when you want to explore ideas, practice social interactions, or simply have a judgment-free conversation. Our journey hasn't been without its
        challenges. We've bootstrapped this project from the ground up, pouring our hearts (and a fair bit of sweat) into every line of code. We're constantly fine-tuning, learning, and adapting as AI technology evolves.
      </Text>

      <Text className='text-white' size='lg'>
        Privacy is paramount in our eyes. Your conversations with BFFL are yours alone – no data mining, no advertising, no compromises. It's as personal as a diary, but one that talks back and asks questions. We're on a journey to understand how AI companionship can enrich lives while respecting the irreplaceable
        value of human connections. We don't have all the answers, but we're eager to explore this new frontier. And we invite you to join us – to play, to learn, to imagine. Welcome to BFFL. Let's reimagine friendship, one conversation at a time.
      </Text>
      <Text className='text-white' size='lg'>
        BFFL.AI is based in the U.S.A and registered as an LLC in Dover, DE © Copyright 2024 BFFL.AI, LLC
      </Text>
    </View>
  )
}
