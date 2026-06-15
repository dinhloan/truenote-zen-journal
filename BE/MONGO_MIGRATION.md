# MongoDB Atlas production migration

TrueNote backend now uses MongoDB through Mongoose. Production must provide
`MONGODB_URI` from the Render environment.

## Render environment

Set these variables on the Render Web Service:

```text
NODE_ENV=production
PORT=10000
MONGODB_URI=<MongoDB Atlas connection string>
JWT_SECRET=<existing production secret>
CLIENT_ORIGIN=https://truenote-zen-journal.netlify.app
```

Do not commit real `.env` files or secret values.

## Data model mapping

If old SQLite data needs to be preserved, export it before redeploying the
MongoDB version. Render Free disk data may be ephemeral, so there may be no
durable SQLite file to migrate.

Suggested one-time migration mapping:

```text
users.email -> users.email
users.name -> users.name
users.password_hash -> users.passwordHash

daily_entries.user_id -> dailyentries.userId
daily_entries.date -> dailyentries.date
daily_entries.raw_content -> dailyentries.rawContent
daily_entries.status -> dailyentries.status

reality_checks.daily_entry_id -> realitychecks.dailyEntryId
reality_checks.facts JSON -> realitychecks.facts

verifications.daily_entry_id -> verifications.dailyEntryId
verifications.supporting_basis JSON -> verifications.supportingBasis
verifications.alternative_possibilities JSON -> verifications.alternativePossibilities

awareness_traces.daily_entry_id -> awarenesstraces.dailyEntryId
awareness_traces.verification_id -> awarenesstraces.verificationId
awareness_traces.themes JSON -> awarenesstraces.themes

themes.name -> themes.name
themes.trace_count -> themes.traceCount
themes.related_themes JSON -> themes.relatedThemes
```

Because SQLite used UUID strings and MongoDB uses ObjectIds, a migration script
must build an ID map while inserting records:

1. Insert users first, store `oldUserId -> newUserObjectId`.
2. Insert daily entries, store `oldDailyEntryId -> newDailyEntryObjectId`.
3. Insert reality checks and verifications using the mapped user/daily IDs.
4. Insert awareness traces using mapped user, daily entry, and verification IDs.
5. Rebuild themes with `syncThemesForUser` or insert mapped theme rows.

For a fresh production deploy with no SQLite data to preserve, no migration
script is required. Set `MONGODB_URI`, redeploy, then register/login normally.
