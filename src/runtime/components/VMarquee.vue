<script setup lang="ts">
import type { TDirection } from "~/src/runtime/types/direction.type"; // Type for animation direction
import type { TTimingFunction } from "~/src/runtime/types/timingFunction"; // Type for timing function

//#region PROPS
// Define props with default values for duration, delay, direction, and timing function
const props = withDefaults(
  defineProps<{
    duration?: number | string,                // Duration of the animation in seconds
    delay?: number | string,                   // Delay before starting the animation in seconds
    direction?: TDirection,           // Direction of the animation (normal or reverse)
    timingFunction?: TTimingFunction  // Speed curve for the animation
  }>(),
  {
    duration: 3,               // Default duration: 3 seconds
    delay: 0,                  // Default delay: 0 seconds
    direction: 'normal',       // Default direction: normal
    timingFunction: "linear"   // Default timing function: linear
  }
)
//#endregion

//#region VARIABLES
// Reference to the marquee content div element for applying styles directly
const marqueeContent = ref<HTMLDivElement | null>(null);
//#endregion

//#region HOOKS
// onMounted hook to apply animation styles after component is mounted
onMounted(() => {
  // Validate and apply duration and delay values
  const duration = validateDurationAndDelay(props.duration, 3);
  const delay = validateDurationAndDelay(props.delay, 0);

  // Validate and apply direction and timing function values
  const direction = isValidDirection(props.direction) ? props.direction : 'normal';
  const timingFunction = isValidSpeed(props.timingFunction) ? props.timingFunction : 'linear';

  // Apply animation styles to marqueeContent element
  if (marqueeContent.value) {
    marqueeContent.value.style.animationDuration = `${duration}s`;
    marqueeContent.value.style.animationDelay = `${delay}s`;
    marqueeContent.value.style.animationIterationCount = 'infinite'; // Infinite iteration for marquee effect
    marqueeContent.value.style.animationDirection = direction;
    marqueeContent.value.style.animationTimingFunction = timingFunction;
  }
});
//#endregion

//#region FUNCTIONS
// Utility function to validate and return valid duration and delay values
const validateDurationAndDelay = (value: unknown, defaultValue: number): number => {
  const parsedValue = typeof value === 'string' ? parseFloat(value) : value;
  return typeof parsedValue === 'number' && parsedValue > 0 ? parsedValue : defaultValue;
};

// Type guard for direction validation (either 'normal' or 'reverse')
const isValidDirection = (direction: unknown): direction is TDirection => {
  return ['normal', 'reverse'].includes(direction as string);
};

// Type guard for timing function validation (allowing specific CSS timing functions)
const isValidSpeed = (timingFunction: unknown): timingFunction is TTimingFunction => {
  return ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'].includes(timingFunction as string);
};
//#endregion
</script>

<template>
  <!-- Container for the marquee, holds the animated content -->
  <div ref="marqueeContainer" class="marquee-container">
    <!-- Apply the ref to the actual content that will be animated -->
    <div ref="marqueeContent" class="marquee-content">
      <slot></slot> <!-- Slot for user-provided content -->
    </div>
  </div>
</template>

<style scoped>
/* Styling for the container holding the marquee */
.marquee-container {
  @apply p-0.5 overflow-hidden whitespace-nowrap box-border;
  /* Styling for size and overflow */
}

/* Base styling for the animated content */
.marquee-content {
  display: inline-block; /* Ensure content is treated as inline for animation */
  animation: marqueeAnimation linear infinite; /* Apply marquee animation */
  white-space: nowrap; /* Prevent content from wrapping */
}

/* Keyframes for the marquee animation (moving from right to left) */
@keyframes marqueeAnimation {
  0% {
    transform: translateX(200%); /* Start from the right side (off-screen) */
  }
  50% {
    transform: translateX(0); /* Center position (fully visible) */
  }
  100% {
    transform: translateX(-200%); /* End at the left side (off-screen) */
  }
}
</style>
