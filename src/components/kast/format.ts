export function membershipLabel(type?: string | null) {
  return ({EenKeerPerWeek:'1× per week',TweeKeerPerWeek:'2× per week',Onbeperkt:'Onbeperkt',CursusAddendum:'Cursusabonnement'} as Record<string,string>)[type || ''] || 'Geen abonnement'
}
export function visitLimit(type?: string | null) {
  return type==='Onbeperkt' ? Infinity : type==='TweeKeerPerWeek' ? 2 : type==='EenKeerPerWeek' ? 1 : 0
}
export function dateLabel(value: string) {
  return new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'short',year:'numeric',timeZone:'Europe/Amsterdam'}).format(new Date(value))
}
export function timeLabel(value: string) {
  return new Intl.DateTimeFormat('nl-NL',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Amsterdam'}).format(new Date(value))
}
