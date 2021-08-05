import { Law, Member, Prosecution } from "@/types";

export function prosecutionExplanation(prosecution:Prosecution, judge:Member){
    return `ברוכים הבאים לבית המשפט
    ${prosecution.prosecutor.name} הגיש תביעה נגד ${prosecution.prosecuted.name}
    על הפרת חוק מספר ${prosecution.law.number} סעיף ${prosecution.section}
    שהוא ${prosecution.punishmentContent.description}
    ראיות התובע: ${prosecution.info}
    כעת השופט ${judge.name} ידון איתכם`;
}

export function prosecutionGroupName(prosecution:Prosecution){
    return `תביעה- חוק ${prosecution.law.number}.${prosecution.section}`
}

export function prosecutionDecided(prosecution:Prosecution){
    return `${prosecution.status==="ACCEPTED"?"התביעה התקבלה":"התביעה נדחתה"}`;
}