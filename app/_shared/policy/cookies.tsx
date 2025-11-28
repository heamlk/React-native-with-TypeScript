import { View, Platform, ScrollView, ScrollViewComponent } from 'react-native'
import { Text } from '../components/reusable'
// Platform-aware line break: {BR} on web, newline on mobile
const BR = Platform.OS === 'web' ? <br /> : '\n'

export default function Cookies() {
  return (
    <ScrollView showsVerticalScrollIndicator={true} contentContainerClassName='px-0 py-8 max-w-4xl mx-auto'>
    <View className='gap-[24px]'>
      <Text className='text-white' size='2xl'>
        Cookie Policy
      </Text>

      <Text className='text-white' size='lg'>
        Last updated: August 8, 2024
      </Text>

      <Text className='text-white' size='lg'>
        This Cookie Policy explains how BFFL.AI LLC (“BFFL.AI,” “we,” “us,” and/or “our”) uses cookies and similar technologies when you visit our website at www.bffl.ai (“Website”). We refer to the Website as the “Services.” Here, we explain what these technologies are and why we use them, as well as your rights to
        control our use of them.
      </Text>

      <Text className='text-white' size='lg'>
        This Cookie Policy should be read in conjunction with our Privacy Policy. If you have any questions or concerns about the Cookie Policy or its implementation, please contact us at info@bffl.ai, or as otherwise described in our Privacy Policy.
      </Text>

      <Text className='text-white' size='xl'>
        1. What are cookies and similar technologies?
      </Text>

      <Text className='text-white' size='lg'>
        Cookies. A cookie is a text file containing a string of characters that is sent to your device when you visit a website. When you visit the website again, the cookie allows that website to recognize your browser. Cookies may store user preferences and other information. Cookies set by the website owner (in this
        case, BFFL.AI) are called “first party cookies.” Cookies set by parties other than the website owner are called “third party cookies.” Third party cookies enable third party features or functionality to be provided on or through a website (e.g., advertising, interactive content, and analytics). The parties that
        set these third party cookies can recognize your device both when it visits the website in question and also when it visits certain other websites.
      </Text>

      <Text className='text-white' size='lg'>
        Local storage. Local storage technologies refer to the methods that websites and applications use to store data locally on your device. The most commonly used local storage technology is called “local Storage” and is part of the HTML5 standard. This technology allows websites or applications to store data that
        persists even after the user closes their browser or application, or restarts their device.
      </Text>

      <Text className='text-white' size='lg'>
        Session storage. Session storage is a feature of your web browser or device that allows a website or application to temporarily store data on your device while you are actively using the website or application. This data is deleted as soon as you close your browser or application, or navigate away from the
        website. Websites and applications may use session storage to improve your experience and ensure that certain information is readily available during your browsing session.
      </Text>

      <Text className='text-white' size='lg'>
        Other tracking technologies. Websites and apps use a variety of other tracking technologies too, including web beacons (also known as tracking pixels), third-party tracking scripts, advertising pixels, and analytics tools. These technologies provide data on how visitors use websites and allow websites to serve
        personalized advertisements. We may also use web beacons and “clear GIFs” in promotional emails and other communications with you, to allow us to count how many people read them and to verify any clicks through to links within an email. If you do not wish for the web beacon to be downloaded onto your device,
        you should select to receive emails from us in plain text rather than HTML.
      </Text>

      <Text className='text-white' size='lg'>
        This Cookie Policy refers to all these technologies collectively as “cookies.”
      </Text>

      <Text className='text-white' size='xl'>
        2. What type of information do cookies collect?
      </Text>

      <Text className='text-white' size='lg'>
        We, our service providers, and our advertising partners automatically log information about an individual’s interactions with our Services, such as:
        {BR}
        - Device information, such as computer or mobile device operating system type and version, manufacturer and model, browser type, screen resolution, RAM and disk size, CPU usage, device type (e.g., phone, tablet), IP address, unique identifiers (including identifiers used for advertising purposes), language
        settings, mobile device carrier, radio/network information (e.g., WiFi, LTE, 5G), and general location information such as city, state, or geographic area.
        {BR}
        - Online activity information, such as pages or screens viewed, how long individuals spend on a page or screen, the website they visited before browsing to our Website, navigation paths between pages or screens, information about activity on a page or screen, access times and duration of access, and whether
        individuals open our marketing emails or click links within them.
        {BR}- We use both persistent cookies and session cookies. Persistent cookies stay on your device for a set period of time or until you delete them, while session cookies are deleted once you close your web browser. We use persistent cookies, for example, to remember any preferences you have or choices you
        make when you use our Website.
      </Text>

      <Text className='text-white' size='xl'>
        3. Why do we use cookies?
      </Text>

      <Text className='text-white' size='lg'>
        We use cookies for the following purposes:
        {BR}
        Essential cookies: These cookies are strictly necessary to provide you with our Services. They provide page navigation and access to secure areas of the Services. You can set your browser to block these cookies, but then some parts of the Services will not work.
        {BR}
        Performance and functionality cookies: These cookies are used to enhance the performance and functionality of Services but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
        {BR}
        Analytics and customization cookies: These cookies collect information that is used either in aggregate form to help us understand how our Services are being used or how effective our marketing campaigns are, or to help us customize our Services for you.
        {BR}
        Advertising cookies: These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.
      </Text>

      <Text className='text-white' size='xl'>
        4. How can you control cookies?
      </Text>

      <Text className='text-white' size='lg'>
        Depending on where you access our Website from, you may be presented with a cookie banner or other tool to provide permissions before we or our service providers set cookies that are not “Essential.” Where this option is available, you may revoke your consent at any time with future effect by clicking here or
        on the cookie settings link in the bottom corner of the Website at any time.
      </Text>

      <Text className='text-white' size='lg'>
        Opt out of selling personal information and sharing for targeted advertising. We share information with third-party advertising partners and allow them to collect information about your visit to our Website using cookies as described above. Our disclosure of information to these partners may be considered a
        “sale” or “sharing” of personal information or “targeted advertising” under applicable laws.
      </Text>

      <Text className='text-white' size='lg'>
        You can also limit online tracking by:
        {BR}
        - Blocking cookies in your browser. Most browsers let you remove or reject cookies, including cookies used for interest-based advertising. To do this, follow the instructions in your browser settings. Many browsers accept cookies by default until you change your settings. For more information about cookies,
        including how to see what cookies have been set on your device and how to manage and delete them, visit www.allaboutcookies.org.
        {BR}
        - Blocking advertising ID use in your mobile settings. Your mobile device settings can provide functionality to limit use of the advertising ID associated with your mobile device for interest-based advertising purposes.
        {BR}- Using privacy plug-ins or browsers. You can block our Website from setting cookies used for interest-based ads by using a browser with privacy features, like Brave, or installing browser plugins like Privacy Badger, Ghostery, or uBlock Origin, and configuring them to block third party cookies/trackers.
        You can also opt out of Google Analytics by downloading and installing the browser plug-in available at: https://tools.google.com/dlpage/gaoptout.
      </Text>

      <Text className='text-white' size='lg'>
        Advertising industry opt-out tools. You can also use these opt-out options to limit use of your information for interest-based advertising by participating companies:
        {BR}
        - Digital Advertising Alliance for Websites
        {BR}
        - Network Advertising Initiative
        {BR}
        - Platform opt-outs. Some of our advertising partners offer opt-out features that let you opt out of use of your information for interest-based advertising. For example, you can opt out of the use of Meta’s cookie for interest-based advertising here.
        {BR}- Note that because these opt-out mechanisms are specific to the device or browser on which they are exercised, you will need to opt out on each browser and device that you use.
      </Text>

      <Text className='text-white' size='lg'>
        Do Not Track. Some Internet browsers can be configured to send “Do Not Track” signals to the online services that you visit. We currently do not respond to “Do Not Track” or similar signals. To find out more about “Do Not Track,” please visit http://www.allaboutdnt.com.
      </Text>

      <Text className='text-white' size='xl'>
        5. How often will we update this Cookie Policy?
      </Text>

      <Text className='text-white' size='lg'>
        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. We will notify you of any material changes to this Cookie Policy prior to the changes becoming effective by posting the changes on this page
        and providing a more prominent notice with on-site or email notifications. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
      </Text>

      <Text className='text-white' size='lg'>
        The date at the top of this Cookie Policy indicates when it was last updated.
      </Text>

      <Text className='text-white' size='xl'>
        6. Where can you get further information?
      </Text>

      <Text className='text-white' size='lg'>
        If you have any questions about our use of cookies or other technologies, please email us at info@bffl.ai.
      </Text>
    </View>
    </ScrollView>
  )
}
