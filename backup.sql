--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: booking_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'cancelled'
);


ALTER TYPE public.booking_status OWNER TO neondb_owner;

--
-- Name: booking_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.booking_type AS ENUM (
    'predefined',
    'custom'
);


ALTER TYPE public.booking_type OWNER TO neondb_owner;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_role AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.user_role OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    pickup_helipad_id integer,
    drop_helipad_id integer,
    custom_pickup_location text,
    custom_drop_location text,
    booking_type public.booking_type NOT NULL,
    booking_date timestamp without time zone NOT NULL,
    passengers integer NOT NULL,
    duration integer NOT NULL,
    total_amount integer NOT NULL,
    payment_status boolean DEFAULT false,
    booking_status public.booking_status DEFAULT 'pending'::public.booking_status NOT NULL,
    booking_reference text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bookings OWNER TO neondb_owner;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO neondb_owner;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: helicopters; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.helicopters (
    id integer NOT NULL,
    name text NOT NULL,
    model text NOT NULL,
    capacity integer NOT NULL,
    image_url text,
    hourly_rate integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.helicopters OWNER TO neondb_owner;

--
-- Name: helicopters_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.helicopters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.helicopters_id_seq OWNER TO neondb_owner;

--
-- Name: helicopters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.helicopters_id_seq OWNED BY public.helicopters.id;


--
-- Name: helipads; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.helipads (
    id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    description text,
    image_url text,
    price_per_hour integer NOT NULL,
    latitude double precision,
    longitude double precision,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.helipads OWNER TO neondb_owner;

--
-- Name: helipads_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.helipads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.helipads_id_seq OWNER TO neondb_owner;

--
-- Name: helipads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.helipads_id_seq OWNED BY public.helipads.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    amount integer NOT NULL,
    payment_reference text NOT NULL,
    payment_method text,
    payment_status text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payments OWNER TO neondb_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO neondb_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: routes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.routes (
    id integer NOT NULL,
    name text NOT NULL,
    source_helipad_id integer,
    destination_helipad_id integer,
    duration integer NOT NULL,
    distance double precision NOT NULL,
    base_price integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    source_location text NOT NULL,
    destination_location text NOT NULL
);


ALTER TABLE public.routes OWNER TO neondb_owner;

--
-- Name: routes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.routes_id_seq OWNER TO neondb_owner;

--
-- Name: routes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.routes_id_seq OWNED BY public.routes.id;


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.testimonials (
    id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer NOT NULL,
    content text NOT NULL,
    is_approved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.testimonials OWNER TO neondb_owner;

--
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.testimonials_id_seq OWNER TO neondb_owner;

--
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    password text,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    auth_provider text,
    auth_provider_id text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: helicopters id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.helicopters ALTER COLUMN id SET DEFAULT nextval('public.helicopters_id_seq'::regclass);


--
-- Name: helipads id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.helipads ALTER COLUMN id SET DEFAULT nextval('public.helipads_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: routes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.routes ALTER COLUMN id SET DEFAULT nextval('public.routes_id_seq'::regclass);


--
-- Name: testimonials id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bookings (id, user_id, pickup_helipad_id, drop_helipad_id, custom_pickup_location, custom_drop_location, booking_type, booking_date, passengers, duration, total_amount, payment_status, booking_status, booking_reference, created_at) FROM stdin;
15	3	\N	\N	gandibazar	jayanagar	custom	2025-05-31 12:00:00	2	45	35400	t	confirmed	VV234834965	2025-05-30 09:43:54.870375
16	3	\N	\N	majestic	kempagouda airport	custom	2025-05-31 14:00:00	3	30	354000	t	confirmed	VV359296961	2025-05-30 09:45:59.411112
18	7	\N	\N	majestic	kempagouda airport	custom	2025-05-31 14:00:00	3	30	354000	t	cancelled	VV283055304	2025-05-30 11:24:43.249633
17	7	\N	\N	majestic	gandhinagar	custom	2025-06-07 13:00:00	2	49	2832	t	cancelled	VV769758076	2025-05-30 10:59:29.794657
14	3	\N	\N	majestic	jayanagar	custom	2025-05-31 13:00:00	2	30	236000	t	completed	VV134695248	2025-05-30 09:25:34.840038
19	3	\N	\N	bow1	manglore	custom	2025-05-30 12:00:00	3	30	354000	t	cancelled	VV046021169	2025-05-30 11:37:26.151774
13	10	\N	\N	jayanagar	kempagouda airport	custom	2025-06-01 17:00:00	2	20	3540	t	cancelled	VV132941395	2025-05-30 09:08:52.986115
20	13	\N	\N	majestic	kempagouda airport	custom	2025-06-20 05:30:00	2	30	236000	t	cancelled	VV283782023	2025-06-02 11:38:06.518834
\.


--
-- Data for Name: helicopters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.helicopters (id, name, model, capacity, image_url, hourly_rate, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: helipads; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.helipads (id, name, location, description, image_url, price_per_hour, latitude, longitude, is_active, created_at) FROM stdin;
4	Kempegowda Airport Helipad	Bangalore Airport	Airport helipad for quick transfers	\N	30000	13.1986	77.7064	t	2025-05-29 11:06:00.329634
5	Whitefield Helipad	Whitefield, Bangalore	Tech park area helipad	\N	22000	12.9698	77.75	t	2025-05-29 11:06:00.329634
2	Brigade Road Helipad	Brigade Road, Bangalore	Central business district helipad	https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80	25000	12.9719	77.6032	t	2025-05-29 11:06:00.329634
3	Electronic City Helipad	Electronic City, Bangalore	IT hub helipad	https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80	20000	12.8456	77.6648	t	2025-05-29 11:06:00.329634
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payments (id, booking_id, amount, payment_reference, payment_method, payment_status, created_at) FROM stdin;
13	13	3540	PAY-bdb490f9	card	completed	2025-05-30 09:08:53.032904
14	14	236000	PAY-eb316729	upi	completed	2025-05-30 09:25:34.875389
15	15	35400	PAY-3b6dbde9	upi	completed	2025-05-30 09:43:54.913035
16	16	354000	PAY-88f0d24d	upi	completed	2025-05-30 09:45:59.442736
17	17	2832	PAY-8d8ea6bc	upi	completed	2025-05-30 10:59:29.825789
18	18	354000	PAY-2c84050c	upi	completed	2025-05-30 11:24:43.305379
19	19	354000	PAY-925f2251	upi	completed	2025-05-30 11:37:26.27967
20	20	236000	PAY-c500d308	upi	completed	2025-06-02 11:38:06.834148
\.


--
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.routes (id, name, source_helipad_id, destination_helipad_id, duration, distance, base_price, is_active, created_at, source_location, destination_location) FROM stdin;
12	majestic to gandinagar	\N	\N	49	7	1200	t	2025-05-29 12:48:25.268804	majestic	gandhinagar
13	bow bow	\N	\N	67	567	12333	t	2025-05-29 13:02:43.114877	bow1	bow2
14	adc1 to abc2	\N	\N	45	3	15000	t	2025-05-30 08:02:57.874023	gandibazar	jayanagar
15	bengalore airport	\N	\N	20	25	1500	t	2025-05-30 09:03:10.969151	jayanagar	kempagouda airport
16	hubali to mangalore	\N	\N	30	5	15000	t	2025-05-30 09:56:37.360258	hubali	manglore
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.testimonials (id, user_id, rating, content, is_approved, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, name, email, phone, password, role, auth_provider, auth_provider_id, created_at) FROM stdin;
8	tejas	tejj@gmail.com	9112356789	$2b$12$64lmxyFm5u2s6Xr6lqq/t.YxAG.qREp2CB6iAQe2FerQ5vj8lYeOy	user	\N	\N	2025-05-30 08:22:13.633272
10	arjun	arjun@mail.com	9223344590	$2b$12$WQZ736xq16YeT3X2Anq7jeKg1ayOA9UuUUUdjt.UWoE5NbMpfkS7m	user	\N	\N	2025-05-30 09:06:45.150509
11	karthik	kar@gmail.com	9900900999	$2b$12$2spS8Oy3RfhkVLTc.q22BeoEHcnU6pRNim5daQuRgcLOBBuSSuPc6	user	\N	\N	2025-05-30 09:23:50.294484
12	tang	tang@gmail.com	9112356789	$2b$12$obIqJNjXPnFuSJqqOUD.LenDKbGBX3cBO1H0BbtelV8rUZmxWt4v.	user	\N	\N	2025-05-30 09:47:20.147836
3	Admin	admin@gmail.com	7396804222	$2b$10$hyB2/Azds3RgL59lO.fQd.2X5v/9o/ZUZGx.ZJUnk4tXkwrBi6doC	admin	\N	\N	2025-05-29 10:38:39.327926
7	bow	bow@gmail.com	6666666666	$2b$12$NCn0El2KpJGdVpOgem4f5.AREP9quRgpMmQaHFPXxGXTOqlMYVNHm	user	\N	\N	2025-05-29 12:50:56.379556
5	arjun 	arj@gmail.com	9112356789	$2b$12$gYQBEdfx8t3AB8YU/uNuKepE9LddzRDdcyXkqO.0HV8fYf4hyZopu	user	\N	\N	2025-05-29 11:10:43.276347
4	arjun 	arjun@gmail.com	9112356789	$2b$12$4LeiGSnLmRT9gDopel.5q.GrkINt2e9wWY0CqU0uvXMIOt3kyyRjm	user	\N	\N	2025-05-29 10:46:37.168685
13	tajass	teja@gmail.com	9112356789	$2b$12$IQnjsc/yi7ddrzUHL7/6/.or9J7gX6lcVymWFjsQg43bSAgPNNT5O	user	\N	\N	2025-06-02 11:37:00.069824
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bookings_id_seq', 20, true);


--
-- Name: helicopters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.helicopters_id_seq', 1, false);


--
-- Name: helipads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.helipads_id_seq', 5, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.payments_id_seq', 20, true);


--
-- Name: routes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.routes_id_seq', 16, true);


--
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: helicopters helicopters_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.helicopters
    ADD CONSTRAINT helicopters_pkey PRIMARY KEY (id);


--
-- Name: helipads helipads_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.helipads
    ADD CONSTRAINT helipads_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_drop_helipad_id_helipads_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_drop_helipad_id_helipads_id_fk FOREIGN KEY (drop_helipad_id) REFERENCES public.helipads(id);


--
-- Name: bookings bookings_pickup_helipad_id_helipads_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pickup_helipad_id_helipads_id_fk FOREIGN KEY (pickup_helipad_id) REFERENCES public.helipads(id);


--
-- Name: bookings bookings_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_booking_id_bookings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_bookings_id_fk FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: routes routes_destination_helipad_id_helipads_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_destination_helipad_id_helipads_id_fk FOREIGN KEY (destination_helipad_id) REFERENCES public.helipads(id);


--
-- Name: routes routes_source_helipad_id_helipads_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_source_helipad_id_helipads_id_fk FOREIGN KEY (source_helipad_id) REFERENCES public.helipads(id);


--
-- Name: testimonials testimonials_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

