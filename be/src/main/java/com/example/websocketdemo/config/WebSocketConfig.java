package com.example.websocketdemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;

import java.security.Principal;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    public static final String IP_ADDRESS = "IP_ADDRESS";

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/websocket/tracker")
                .setHandshakeHandler(defaultHandshakeHandler())
                .setAllowedOriginPatterns("http://localhost:5173")
                .addInterceptors(httpSessionHandshakeInterceptor())
                .withSockJS();
    }

    @Bean
    public HandshakeInterceptor httpSessionHandshakeInterceptor() {
        return new HandshakeInterceptor() {
            @Override
            public boolean beforeHandshake(
                    ServerHttpRequest request,
                    ServerHttpResponse response,
                    WebSocketHandler wsHandler,
                    Map<String, Object> attributes
            ) {
                if (request instanceof ServletServerHttpRequest servletRequest) {
                    attributes.put(IP_ADDRESS, servletRequest.getRemoteAddress());
                }
                return true;
            }

            @Override
            public void afterHandshake(
                    ServerHttpRequest request,
                    ServerHttpResponse response,
                    WebSocketHandler wsHandler,
                    Exception exception
            ) {
                // no-op
            }
        };
    }

    private DefaultHandshakeHandler defaultHandshakeHandler() {
        return new DefaultHandshakeHandler() {
            @Override
            protected Principal determineUser(
                    ServerHttpRequest request,
                    WebSocketHandler wsHandler,
                    Map<String, Object> attributes
            ) {
                Principal principal = request.getPrincipal();
                if (principal == null) {
                    Authentication anonymous = new AnonymousAuthenticationToken(
                            "WebSocketConfig",
                            "anonymous",
                            AuthorityUtils.createAuthorityList("ROLE_ANONYMOUS")
                    );
                    return anonymous;
                }
                return principal;
            }
        };
    }
}
