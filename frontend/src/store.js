import { create } from 'zustand';
import interFont from '@fontsource/inter/files/inter-latin-400-normal.woff';

export const useCardStore = create((set) => ({
  cardData: {
    name: 'Gaurav Rai',
    designation: 'Software Engineer',
    company: 'TECHSOL',
    tagline: 'Crafting immersive digital identities',
    location: 'New Delhi, India',
    linkedin: 'linkedin.com/in/gauravrai',
    twitter: '@gaurav3d',
    phone: '+91 8081547449',
    email: 'gauravrai01882002@gmail.com',
    website: 'www.3DBuilder.com',
    color1: '#3b82f6',
    color2: '#8b5cf6',
    textColor: '#ffffff',
    style: 'glass',
    font: interFont,
    visibleFields: {
      name: true,
      designation: true,
      company: true,
      tagline: true,
      location: true,
      phone: true,
      email: true,
      website: true,
      linkedin: true,
      twitter: true
    }
  },
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  updateCard: (newData) => set((state) => ({ cardData: { ...state.cardData, ...newData } })),

  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  setCardData: (data) => set({ cardData: data }),
}));
