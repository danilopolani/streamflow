import { NIcon } from 'naive-ui';
import { h, type VNode, type Component } from 'vue';

export function renderIcon(icon: Component, color?: 'red' | 'yellow' | 'green'): () => VNode {
  const colorToApply = {
    red: '#f87171',
    yellow: '#facc15',
    green: '#4ade80',
    _noop: undefined,
  }[color || '_noop'];

  return () => h(NIcon, { color: colorToApply }, {
    default: () => h(icon),
  });
}

export function formatDateDiff(pastDate: string) {
  const diffInMinutes = Math.round((new Date(pastDate).getTime() - new Date().getTime()) / 1000 / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);
  const diffInMonths = Math.round(diffInDays / 30); // Not totally accurate since we use 30days, but we're gonna deal with it
  const diffInYears = Math.round(diffInDays / 365);

  const formatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
  });

  if (Math.abs(diffInMinutes) < 1) {
    return 'Just now';
  }

  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, 'minutes');
  }

  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, 'hours');
  }

  if (Math.abs(diffInDays) < 30) {
    return formatter.format(diffInDays, 'days');
  }

  if (Math.abs(diffInMonths) < 12) {
    return formatter.format(diffInMonths, 'months');
  }

  return formatter.format(diffInYears, 'years');
}
