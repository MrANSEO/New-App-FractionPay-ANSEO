import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Utilisez à la place de `useDispatch` et `useSelector` types par défaut
 * afin d'avoir une typage plus strict et éviter les erreurs.
 */

// Hook personnalisé pour useDispatch avec le bon type
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook personnialisé pour useSelector avec le bon type
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;