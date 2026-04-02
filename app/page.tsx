"use client";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Users,
  ShieldCheck,
  MessageSquare,
  TrendingUp,
  Check,
  Star,
  Clock,
  Wrench,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const scaleVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.6 },
};

const tilt3d = {
  initial: { rotateX: 0, rotateY: 0, scale: 1 },
  animate: (custom: number) => ({
    rotateX: [0, -5, 0],
    rotateY: [0, 15, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: custom * 0.2,
    },
  }),
};

const layerParallax = {
  initial: { opacity: 0.5, scale: 0.95 },
  animate: (custom: number) => ({
    opacity: [0.5, 0.8, 0.5],
    scale: [0.95, 1, 0.95],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    },
  }),
};

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x: x * 20, y: y * 20 });
  };
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-red-600" />,
      title: "Fast Service Booking",
      description: "Book a mechanic in seconds with real-time availability",
      image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=300&h=200&fit=crop",
    },
    {
      icon: <Users className="w-8 h-8 text-red-600" />,
      title: "Fleet Management",
      description: "Track all your vehicles' service history and maintenance",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
      title: "Trusted Mechanics",
      description: "Verified professionals with transparent pricing",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=200&fit=crop",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-red-600" />,
      title: "Live Chat Support",
      description: "Real-time communication with mechanics and admins",
      image: "https://images.unsplash.com/photo-1516534775068-bb57014e50d7?w=300&h=200&fit=crop",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-red-600" />,
      title: "Repair Tracking",
      description: "Monitor your repairs from start to finish",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
      title: "Secure Marketplace",
      description: "Buy and sell verified vehicles safely",
      image: "https://images.unsplash.com/photo-1519641471654-7627048f5f67?w=300&h=200&fit=crop",
    },
  ];

  const services = [
    {
      name: "Engine Diagnostics",
      time: "15-30 min",
      price: "₦5,000",
      image: "https://images.unsplash.com/photo-1486262715619-67b519e0abe5?w=400&h=300&fit=crop",
    },
    {
      name: "Oil Change",
      time: "20-40 min",
      price: "₦3,500",
      image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop",
    },
    {
      name: "Brake Service",
      time: "1-2 hours",
      price: "₦15,000",
      image: "https://images.unsplash.com/photo-1533473359331-35a2a3a36fca?w=400&h=300&fit=crop",
    },
    {
      name: "AC Repair",
      time: "30-60 min",
      price: "₦12,000",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    },
    {
      name: "Suspension & Steering",
      time: "2-3 hours",
      price: "₦20,000",
      image: "https://images.unsplash.com/photo-1487754180144-351b8f186060?w=400&h=300&fit=crop",
    },
    {
      name: "Battery Replacement",
      time: "30-45 min",
      price: "₦8,000",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
    },
  ];

  const testimonials = [
    {
      name: "Ibrahim Hassan",
      role: "Business Owner",
      text: "AutoFlow saved me hours. I can now book services in minutes instead of calling around.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
    {
      name: "Chioma Okonkwo",
      role: "Fleet Manager",
      text: "Managing 15 vehicles has never been easier. The tracking is incredible.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
    {
      name: "Ahmed Adebayo",
      role: "Professional Driver",
      text: "Best service platform in Nigeria. Mechanics are reliable and prices are transparent.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-red-600"
          >
            AutoFlow Pro
          </motion.div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="btn-ghost">
              Login
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        className="pt-32 pb-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 text-white relative overflow-hidden min-h-screen flex items-center"
        onMouseMove={handleMouseMove}
      >
        {/* 3D Background Layers */}
        <div style={{ perspective: "1200px" }} className="absolute inset-0 overflow-hidden">
          {/* Layer 1 - Far Background */}
          <motion.div
            custom={0}
            variants={layerParallax}
            initial="initial"
            animate="animate"
            className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"
          />

          {/* Layer 2 - Mid Background */}
          <motion.div
            custom={50}
            variants={layerParallax}
            initial="initial"
            animate="animate"
            className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"
          />

          {/* Layer 3 - Front Rotating Blobs */}
          <motion.div
            animate={{ rotate: 360, x: [0, 50, 0], y: [0, 50, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-2xl"
          />

          <motion.div
            animate={{ rotate: -360, x: [0, -50, 0], y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-red-400/20 to-transparent rounded-full blur-2xl"
          />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div variants={containerVariants}>
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            >
              Your Complete Car Care Solution
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Professional mechanic services, fleet management, and a trusted marketplace — all in one platform.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex gap-4 flex-wrap"
            >
              <Link href="/auth/signup" className="btn-primary">
                Start Free <ArrowRight className="inline ml-2 w-5 h-5" />
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-ghost text-white border border-white hover:bg-white/10"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* 3D Hero Image Container */}
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="relative h-96 md:h-full flex items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            {/* Outer 3D Frame - Rotates */}
            <motion.div
              custom={0}
              variants={tilt3d}
              animate="animate"
              initial="initial"
              style={{
                rotateX: mousePosition.y,
                rotateY: mousePosition.x,
              }}
              className="relative w-full"
            >
              {/* Shadow Layer - Behind image */}
              <motion.div
                className="absolute -inset-8 bg-gradient-to-br from-red-600/30 to-red-900/30 rounded-3xl blur-2xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Main Image Container */}
              <motion.div
                initial={scaleVariants.initial}
                animate={scaleVariants.animate}
                transition={scaleVariants.transition}
                className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-8 shadow-2xl overflow-hidden group"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Glossy Overlay - 3D shine effect */}
                <motion.div
                  animate={{
                    backgroundPosition: ["200% 200%", "0% 0%", "200% 200%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundSize: "200% 200%",
                    mixBlendMode: "overlay",
                  }}
                />

                {/* Image with 3D depth */}
                <div className="w-full h-96 bg-gradient-to-br from-red-400 to-red-800 rounded-xl overflow-hidden relative z-10"
                  style={{ transformStyle: "preserve-3d" }}>
                  <motion.img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop"
                    alt="Professional mechanic working on car"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent flex items-end justify-center pb-6">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-white font-semibold text-lg"
                    >
                      Expert Mechanics at Your Service
                    </motion.p>
                  </div>
                </div>

                {/* 3D Border Glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/10"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Corner Accent Lights - 3D effect */}
              {[0, 1, 2, 3].map((idx) => (
                <motion.div
                  key={idx}
                  className="absolute w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full blur-xl opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.4, 0.1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: idx * 0.3,
                  }}
                  style={{
                    top: idx < 2 ? "-20px" : "auto",
                    bottom: idx >= 2 ? "-20px" : "auto",
                    left: idx % 2 === 0 ? "-20px" : "auto",
                    right: idx % 2 === 1 ? "-20px" : "auto",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-12 px-4 bg-red-50"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          {[
            { number: "500+", label: "Happy Customers" },
            { number: "50+", label: "Professional Mechanics" },
            { number: "1000+", label: "Repairs Completed" },
            { number: "98%", label: "Customer Satisfaction" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-4"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                className="text-4xl font-bold text-red-600 mb-2"
              >
                {stat.number}
              </motion.div>
              <p className="text-gray-700 font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-dark">Powerful Features</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Everything you need for professional car care and management
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="card p-0 cursor-pointer transition-all overflow-hidden"
              >
                {feature.image && (
                  <div className="h-40 overflow-hidden bg-gray-200">
                    <motion.img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="mb-4"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold mb-4 text-center text-dark"
          >
            Our Services
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-2 gap-6 mt-12"
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="card overflow-hidden rounded-lg border-l-4 border-red-600 bg-white hover:shadow-lg transition-all"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-dark">{service.name}</h3>
                    <p className="text-gray-600 flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4" />
                      {service.time}
                    </p>
                  </div>
                  <motion.div
                    className="text-2xl font-bold text-red-600"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {service.price}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold mb-12 text-center"
          >
            What Our Customers Say
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-red-600"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <motion.div
                  className="flex gap-1 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </motion.div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold mb-12 text-center text-dark"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: "1", title: "Book", desc: "Select your service" },
              { number: "2", title: "Confirm", desc: "Get instant confirmation" },
              { number: "3", title: "Service", desc: "Professional mechanics arrive" },
              { number: "4", title: "Pay", desc: "Secure payment & receipt" },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="text-center relative"
              >
                <motion.div
                  className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 relative z-10"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)" }}
                >
                  {step.number}
                </motion.div>
                {idx < 3 && (
                  <motion.div
                    animate={{ scaleX: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-8 left-[55%] w-12 h-1 bg-gradient-to-r from-red-600 to-transparent origin-left"
                  />
                )}
                <h3 className="text-xl font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-red-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: <Phone className="w-8 h-8" />, title: "Call Us", value: "+234-700-000-0000" },
            { icon: <MapPin className="w-8 h-8" />, title: "Visit Us", value: "Lagos, Nigeria" },
            { icon: <Clock className="w-8 h-8" />, title: "Hours", value: "24/7 Available" },
          ].map((contact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <motion.div
                className="flex justify-center mb-4 text-red-600"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {contact.icon}
              </motion.div>
              <h3 className="font-bold text-dark mb-2">{contact.title}</h3>
              <p className="text-gray-600">{contact.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-red-100"
          >
            Join thousands of users who trust AutoFlow Pro for their car care
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/auth/signup" className="btn-primary inline-block">
              Create Account Free <ArrowRight className="inline ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-gray-900 text-gray-400 py-12 px-4"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          {[
            {
              title: "AutoFlow Pro",
              items: ["Professional car care made simple"],
            },
            {
              title: "Product",
              items: ["Features", "Pricing", "Blog"],
            },
            {
              title: "Company",
              items: ["About", "Contact", "Careers"],
            },
            {
              title: "Legal",
              items: ["Privacy", "Terms"],
            },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h4 className="text-white font-bold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-t border-gray-800 pt-8 text-center"
        >
          <p>&copy; 2026 AutoFlow Pro. All rights reserved.</p>
        </motion.div>
      </motion.footer>
    </div>
  );
}
