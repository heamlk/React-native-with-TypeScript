import useDimensions from "./dimensions";

export const breakpoints = {
  phone: 719,
  tablet: 1280,
};

export default function useBreakpoints() {
  const { deviceWidth } = useDimensions();

  if (deviceWidth < breakpoints.phone) return "phone";
  if (deviceWidth < breakpoints.tablet) return "tablet";
  return "desktop";
}
