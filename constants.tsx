
import React from 'react';
import { AppIcon, GhoIcon, BarChartIcon, BrandIcon, FaqIcon, HelpIcon, GovernanceIcon, BuildIcon, DocsIcon, SecurityIcon, BugBountyIcon, MedalIcon } from './components/icons/Icons';
import { AppView } from './types';

export type NavAction = 'scroll' | 'navigate';

interface NavItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  graphicClass?: string;
  action: NavAction;
  target: string | AppView;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_LINKS: Record<string, NavSection> = {
  products: {
    title: 'Features',
    items: [
      {
        icon: <AppIcon />,
        title: 'Real-Time Monitoring',
        description: 'Live feedback on your posture.',
        color: 'bg-indigo-100',
        graphicClass: 'bg-indigo-300',
        action: 'scroll',
        target: 'real-time-monitoring'
      },
      {
        icon: <GhoIcon />,
        title: 'The AI Model',
        description: 'Intelligent posture assessment.',
        color: 'bg-green-100',
        graphicClass: 'bg-green-300',
        action: 'scroll',
        target: 'ai-model'
      },
    ],
  },
  resources: {
    title: 'Resources',
    items: [
      {
        icon: <MedalIcon />, 
        title: 'Pricing',
        description: 'Plans for every need.',
        graphicClass: 'bg-yellow-300',
        action: 'navigate',
        target: 'pricing'
      },
      {
        icon: <BarChartIcon />,
        title: 'Blog',
        description: 'The latest news and updates.',
        graphicClass: 'bg-blue-300',
        action: 'navigate',
        target: 'blog'
      },
      {
        icon: <BrandIcon />,
        title: 'Posture Guides',
        description: 'Assets, examples and guides.',
        graphicClass: 'bg-purple-300',
        action: 'navigate',
        target: 'guides'
      },
      {
        icon: <FaqIcon />,
        title: 'FAQ',
        description: 'Answers to common questions.',
        graphicClass: 'bg-teal-300',
        action: 'scroll',
        target: 'faq'
      },
      {
        icon: <HelpIcon />,
        title: 'Help & Support',
        description: 'Contact us and get help.',
        graphicClass: 'bg-orange-300',
        action: 'navigate',
        target: 'support'
      },
      {
        icon: <GovernanceIcon />,
        title: 'Community',
        description: 'Join the discussion forum.',
        graphicClass: 'bg-sky-300',
        action: 'navigate',
        target: 'community'
      },
    ],
  },
  developers: {
    title: 'Developers',
    items: [
       {
        icon: <BuildIcon />,
        title: 'Build',
        description: 'Integrate Poisé.',
        graphicClass: 'bg-indigo-400',
        action: 'navigate',
        target: 'build'
      },
       {
        icon: <DocsIcon />,
        title: 'Documentation',
        description: 'Technical guides for developers.',
        graphicClass: 'bg-cyan-400',
        action: 'navigate',
        target: 'docs'
      },
       {
        icon: <SecurityIcon />,
        title: 'Security',
        description: 'Audit reports and information.',
        graphicClass: 'bg-yellow-400',
        action: 'navigate',
        target: 'security'
      },
       {
        icon: <BugBountyIcon />,
        title: 'Bug Bounty',
        description: 'Report responsibly and get rewarded.',
        graphicClass: 'bg-amber-400',
        action: 'navigate',
        target: 'bug-bounty'
      },
    ],
  },
};
