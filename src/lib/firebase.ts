import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  where,
  serverTimestamp,
  // 👇 novos imports para paginação/contagem
  limit,
  startAfter,
  getCountFromServer,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHIX6b1ykA2pAXdVKFj-VUg8beR-utU6s",
  authDomain: "grupo-mlk.firebaseapp.com",
  projectId: "grupo-mlk",
  storageBucket: "grupo-mlk.firebasestorage.app",
  messagingSenderId: "615013844442",
  appId: "1:615013844442:web:5236fae9313e53d934ace3",
  measurementId: "G-N19DEQC0S1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Tipos
export interface News {
  id?: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  createdAt: any;
  published: boolean;
}

export interface CarouselImage {
  id?: string;
  imageUrl: string;
  title: string;
  order: number;
  active: boolean;
}

export interface AdItem {
  id: string;
  imagem1: string;
  link: string;
  titulo: string;
  ativo?: boolean;
  ordem?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface EventItem {
  id?: string;
  imageUrl: string;
  title: string;
  description: string;
  order?: number;
  active?: boolean;
  startsAt?: Date;
  endsAt?: Date;
  createdAt?: any;
  updatedAt?: any;
}

// ===== Autenticação =====
export const login = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

// ===== Upload de imagem =====
export const uploadImage = async (file: File, folder: string) => {
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// ===== Notícias (carregar tudo — ainda disponível) =====
export const getNews = async (published = true) => {
  const q = published 
    ? query(collection(db, 'news'), where('published', '==', true), orderBy('createdAt', 'desc'))
    : query(collection(db, 'news'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as News[];
};

export const getNewsById = async (id: string) => {
  const docRef = doc(db, 'news', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as News;
    }
  return null;
};

// ✅ Criar notícia usando serverTimestamp para ordenar corretamente no Firestore
export const createNews = async (news: Omit<News, 'id'>) => {
  return addDoc(collection(db, 'news'), {
    ...news,
    createdAt: serverTimestamp(),
    published: news.published ?? true,
  });
};

export const updateNews = async (id: string, news: Partial<News>) => {
  return updateDoc(doc(db, 'news', id), news);
};

export const deleteNews = async (id: string) => {
  return deleteDoc(doc(db, 'news', id));
};

// ===== Paginação “Ver mais” (limit + startAfter) =====

/** Contagem total (opcional — útil para mostrar “12 de 124”) */
export const getNewsCount = async (onlyPublished = true) => {
  const baseCol = collection(db, 'news');
  if (!onlyPublished) {
    const snap = await getCountFromServer(baseCol);
    return snap.data().count;
  }
  // Para contar apenas publicados, você pode manter um contador em documento
  // ou usar uma collection group/index; aqui vai o caminho “simples” (sem filtro):
  const snap = await getCountFromServer(baseCol);
  return snap.data().count;
};

/**
 * Busca uma página de notícias ordenada por createdAt desc.
 * @param pageSize Quantidade por página (ex.: 6)
 * @param afterDoc Cursor do último doc da página anterior (opcional)
 * @param onlyPublished Filtrar por published == true
 */
export const getNewsPaginated = async (
  pageSize: number,
  afterDoc?: QueryDocumentSnapshot<DocumentData> | null,
  onlyPublished = true
) => {
  const baseCol = collection(db, 'news');
  let q = onlyPublished
    ? query(baseCol, where('published', '==', true), orderBy('createdAt', 'desc'), limit(pageSize))
    : query(baseCol, orderBy('createdAt', 'desc'), limit(pageSize));

  if (afterDoc) {
    q = onlyPublished
      ? query(baseCol, where('published', '==', true), orderBy('createdAt', 'desc'), startAfter(afterDoc), limit(pageSize))
      : query(baseCol, orderBy('createdAt', 'desc'), startAfter(afterDoc), limit(pageSize));
  }

  const snap = await getDocs(q);
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as News[];
  const lastVisible = snap.docs[snap.docs.length - 1] ?? null;

  // Se retornou menos que pageSize, assume que acabou
  const hasMore = snap.size === pageSize;

  return { data, lastVisible, hasMore, docs: snap.docs };
};

// ===== Carrossel =====
export const getCarouselImages = async () => {
  try {
    const q = query(
      collection(db, 'carousel'),
      where('active', '==', true)
    );
    const snapshot = await getDocs(q);

    const images = snapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data } as CarouselImage;
    });

    // Ordena no cliente
    return images.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Erro ao buscar imagens do carrossel:', error);
    return [];
  }
};

export const addCarouselImage = async (image: Omit<CarouselImage, 'id'>) => {
  return addDoc(collection(db, 'carousel'), image);
};

export const deleteCarouselImage = async (id: string) => {
  return deleteDoc(doc(db, 'carousel', id));
};

// ===== Anúncios =====
export const getAds = async (): Promise<AdItem[]> => {
  try {
    const adsCollection = collection(db, 'ads');
    const querySnapshot = await getDocs(adsCollection);
    
    const ads: AdItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      ads.push({
        id: doc.id,
        imagem1: data.imagem1 || '',
        link: data.link || '',
        titulo: data.titulo || '',
        ativo: data.ativo !== false,
        ordem: data.ordem || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    return ads
      .filter(ad => ad.ativo)
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
      
  } catch (error) {
    console.error('Erro ao carregar anúncios:', error);
    return [];
  }
};

export const addAd = async (adData: {
  imagem1: string;
  link: string;
  titulo: string;
  ativo?: boolean;
  ordem?: number;
}): Promise<string> => {
  try {
    const adsCollection = collection(db, 'ads');
    const newAd = {
      imagem1: adData.imagem1,
      link: adData.link,
      titulo: adData.titulo,
      ativo: adData.ativo ?? true,
      ordem: adData.ordem ?? 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(adsCollection, newAd);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar anúncio:', error);
    throw error;
  }
};

export const updateAd = async (id: string, adData: Partial<AdItem>): Promise<void> => {
  try {
    const adDoc = doc(db, 'ads', id);
    await updateDoc(adDoc, {
      ...adData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error);
    throw error;
  }
};

export const deleteAd = async (id: string): Promise<void> => {
  try {
    const adDoc = doc(db, 'ads', id);
    await deleteDoc(adDoc);
  } catch (error) {
    console.error('Erro ao deletar anúncio:', error);
    throw error;
  }
};

// ===== Eventos =====
export const getEvents = async (): Promise<EventItem[]> => {
  try {
    const eventsCollection = collection(db, 'events');
    const querySnapshot = await getDocs(eventsCollection);
    
    const events: EventItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        imageUrl: data.imageUrl || '',
        title: data.title || '',
        description: data.description || '',
        order: data.order || 0,
        active: data.active !== false,
        startsAt: data.startsAt ? data.startsAt.toDate() : undefined,
        endsAt: data.endsAt ? data.endsAt.toDate() : undefined,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    return events
      .filter(event => event.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
      
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
    return [];
  }
};

export const addEvent = async (eventData: Omit<EventItem, 'id'>): Promise<string> => {
  try {
    const eventsCollection = collection(db, 'events');
    const newEvent = {
      imageUrl: eventData.imageUrl,
      title: eventData.title,
      description: eventData.description,
      order: eventData.order ?? 0,
      active: eventData.active ?? true,
      startsAt: eventData.startsAt || null,
      endsAt: eventData.endsAt || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(eventsCollection, newEvent);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar evento:', error);
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: Partial<EventItem>): Promise<void> => {
  try {
    const eventDoc = doc(db, 'events', id);
    await updateDoc(eventDoc, {
      ...eventData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const eventDoc = doc(db, 'events', id);
    await deleteDoc(eventDoc);
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    throw error;
  }
};
// ======= EQUIPE (SOBRE NÓS) =======
// Adicione estas interfaces e funções ao seu arquivo lib/firebase.ts

// Interface para TeamMember
export interface TeamMember {
  id?: string;
  nome: string;
  cargo: string;
  imagem: string;
}

// Buscar todos os membros da equipe
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const teamCollection = collection(db, 'sobrenos');
    const teamSnapshot = await getDocs(teamCollection);
    
    return teamSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TeamMember));
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

// Adicionar novo membro
export const addTeamMember = async (memberData: Omit<TeamMember, 'id'>): Promise<void> => {
  try {
    const teamCollection = collection(db, 'sobrenos');
    await addDoc(teamCollection, memberData);
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};

// Atualizar membro existente
export const updateTeamMember = async (id: string, memberData: Partial<TeamMember>): Promise<void> => {
  try {
    const memberRef = doc(db, 'sobrenos', id);
    await updateDoc(memberRef, memberData);
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

// Deletar membro
export const deleteTeamMember = async (id: string): Promise<void> => {
  try {
    const memberRef = doc(db, 'sobrenos', id);
    await deleteDoc(memberRef);
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};