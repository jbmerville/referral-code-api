import { DocumentData, QueryDocumentSnapshot, doc, getDoc } from 'firebase/firestore';

import { FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { ReferralType } from 'src/types/ReferralData';
import { firestore } from './clientApp';

export const getReferralByDocumentId = async (documentId: string): Promise<QueryDocumentSnapshot<DocumentData>> => {
  try {
    const snapshot = await getDoc(doc(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME, documentId));

    if (!snapshot.exists()) {
      const errorMessage = `Document with documentId: ${documentId} does not exist`;
      console.error(errorMessage);
      throw Error(errorMessage);
    }

    return snapshot;
  } catch (error) {
    const errorMessage = `Error querying Firestore with documentId: ${documentId}`;
    console.error(errorMessage, error);
    throw Error(errorMessage);
  }
};
