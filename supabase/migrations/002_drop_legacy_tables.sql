-- Drop 15 tables left over from a previous, abandoned project that
-- happened to share this Supabase project. Surgical — only removes the
-- legacy tables, leaves the TrueRate v1 schema (created by 001) intact.
--
-- Apply once via the Supabase SQL Editor. Safe to re-run.

drop table if exists public.community_availability   cascade;
drop table if exists public.community_rate_reports   cascade;
drop table if exists public.crisis_events            cascade;
drop table if exists public.exchange_rates           cascade;
drop table if exists public.fraud_reports            cascade;
drop table if exists public.gouging_reports          cascade;
drop table if exists public.market_news              cascade;
drop table if exists public.notification_preferences cascade;
drop table if exists public.price_index              cascade;
drop table if exists public.rate_alerts              cascade;
drop table if exists public.rate_feedback            cascade;
drop table if exists public.rate_score_lookups       cascade;
drop table if exists public.sms_subscriptions        cascade;
drop table if exists public.trfn_signals_cache       cascade;
drop table if exists public.user_submissions         cascade;
