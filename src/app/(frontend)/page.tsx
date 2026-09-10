import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import styles from './home.module.css'

export const metadata: Metadata = {
  title: 'Sportschool De Kast',
  description: 'Fitness, cursussen en persoonlijke coaching bij Sportschool De Kast.',
}

export default function HomePage() {
  return (
    <main id="main-content" className={styles.home}>
      <section className={styles.intro}>
        <div className={styles.introCopy}>
          <h1>Sportschool De Kast</h1>
          <p>
            Fitness, cursussen en persoonlijke begeleiding. Meld je aan of log in om je abonnement
            en boekingen te bekijken.
          </p>
          <Link href="/register" className="button button-dark">
            Word lid
          </Link>
        </div>
        <div className={styles.introImage}>
          <Image
            src="/images/gym-floor.jpg"
            alt="Fitnessruimte met halters en trainingsbanken"
            fill
            sizes="(max-width: 650px) calc(100vw - 40px), 300px"
            loading="eager"
          />
        </div>
      </section>
      <section id="aanbod" className={styles.section}>
        <h2>Ons aanbod</h2>
        <div className={styles.offers}>
          {[
            {
              title: 'Fitness',
              text: 'Train zelfstandig met een fitnessabonnement.',
              link: 'Abonnementen bekijken',
              href: '#abonnementen',
            },
            {
              title: 'Cursussen',
              text: 'Bekijk de cursussen en beschikbare tijden.',
              href: '/cursussen',
              link: 'Naar de cursussen',
            },
            {
              title: 'Coaching',
              text: 'Kies een coach en maak een afspraak.',
              link: 'Coaches bekijken',
              href: '/coaches',
            },
          ].map((offer) => (
            <div key={offer.title} className={styles.offer}>
              <h3>{offer.title}</h3>
              <p>{offer.text}</p>
              <Link href={offer.href}>{offer.link}</Link>
            </div>
          ))}
        </div>
      </section>
      <section id="abonnementen" className={styles.section}>
        <h2>Abonnementen</h2>
        <p>Kies je abonnement tijdens het aanmelden.</p>
        <div className={styles.plans}>
          {[
            { title: '1× per week', text: 'Eén fitnessbezoek per week' },
            { title: '2× per week', text: 'Twee fitnessbezoeken per week' },
            { title: 'Onbeperkt', text: 'Fitness zonder weeklimiet' },
          ].map((plan) => (
            <div key={plan.title} className={styles.plan}>
              <h3>{plan.title}</h3>
              <p>{plan.text}</p>
            </div>
          ))}
        </div>
        <Link href="/register" className={styles.link}>
          Aanmelden en abonnement kiezen
        </Link>
        <p className={styles.note}>Voor cursussen heb je een abonnement met cursusrecht nodig.</p>
      </section>
      <section id="werkwijze" className={styles.account}>
        <div>
          <h2>Al lid?</h2>
          <p>Bekijk je abonnement, boek een training en check in.</p>
        </div>
        <Link href="/login" className={styles.link}>
          Inloggen op Mijn De Kast
        </Link>
      </section>
    </main>
  )
}
